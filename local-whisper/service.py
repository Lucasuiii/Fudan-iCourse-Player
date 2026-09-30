#!/usr/bin/env python3
"""Authenticated loopback broker: signed recording -> bounded PCM -> whisper.cpp.
No cookies are copied; source URLs and raw audio are not persisted in the cache.
"""
import argparse
import hashlib
import hmac
import json
import math
import os
import re
from pathlib import Path
import secrets
import signal
import shutil
import subprocess
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, unquote
from urllib.request import Request, urlopen

CHUNK = 20
PROMPT = ''


def validate_source(source):
    if not isinstance(source, str) or len(source) > 8192:
        raise ValueError('视频地址无效')
    u = urlsplit(source)
    if u.scheme != 'https' or u.hostname not in ('icourse.fudan.edu.cn', 'webvpn.fudan.edu.cn') or u.username or u.password or u.port not in (None, 443):
        raise ValueError('只允许已授权的复旦 iCourse / WebVPN HTTPS 录播地址')
    if not u.path.lower().endswith('.mp4'):
        raise ValueError('目前仅支持 MP4 录播，不支持直播')
    return u


def recording_key(source):
    u = validate_source(source)
    return hashlib.sha256(json.dumps([u.hostname, u.path]).encode()).hexdigest()


def cache_key(source, model_id, prompt, start):
    u = validate_source(source)
    # Signatures expire; the recording path identifies the same immutable asset.
    return hashlib.sha256(json.dumps([u.hostname, u.path, model_id, prompt, start, CHUNK, 5], ensure_ascii=False).encode()).hexdigest()


def normalize_segments(segments, offset, start, end):
    cues = []
    for seg in segments:
        a, b = float(seg.get('start', 0)) + offset, float(seg.get('end', 0)) + offset
        text = str(seg.get('text', '')).strip()
        compact = re.sub(r'\W', '', text)
        repeated = re.search(r'(.{2,24}?)\1{4,}', compact)
        if repeated and len(repeated.group(0)) > len(compact) * 0.6: continue
        if seg.get('no_speech_prob', 0) > 0.8 and seg.get('avg_logprob', 0) < -1: continue
        if not text or not math.isfinite(a + b) or b <= a or not start <= (a + b) / 2 < end:
            continue
        cues.append({'start': max(start, a), 'end': min(end, b), 'text': text})
    return cues


def multipart(wav, prompt):
    boundary = secrets.token_hex(16)
    parts = []
    fields = {'language': 'zh', 'response_format': 'verbose_json', 'temperature': '0', 'temperature_inc': '0.2', 'beam_size': '5', 'max_len': '80', 'token_timestamps': 'true', 'prompt': prompt}
    for key, value in fields.items():
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{key}"\r\n\r\n{value}\r\n'.encode())
    parts += [f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio.wav"\r\nContent-Type: audio/wav\r\n\r\n'.encode(), wav, f'\r\n--{boundary}--\r\n'.encode()]
    return b''.join(parts), 'multipart/form-data; boundary=' + boundary


class Engine:
    def __init__(self, model, cache, inference, ffmpeg, media_dir=None):
        self.model = Path(model)
        self.cache = Path(cache); self.cache.mkdir(parents=True, exist_ok=True)
        digest = hashlib.sha256()
        with self.model.open('rb') as f:
            for data in iter(lambda: f.read(4 * 1024 * 1024), b''): digest.update(data)
        self.model_id = digest.hexdigest()
        self.inference = inference; self.ffmpeg = ffmpeg
        self.lock = threading.Lock(); self.last_rtf = None
        self.media_dir = Path(media_dir).resolve() if media_dir else None

    def local_media(self, source):
        name = unquote(validate_source(source).path.rsplit('/', 1)[-1])
        if not self.media_dir or not name or '/' in name or '\\' in name:
            return None
        candidate = (self.media_dir / name).resolve()
        if candidate.parent != self.media_dir or not candidate.is_file():
            return None
        return candidate

    def local_clip(self, source):
        if not self.media_dir: return None
        registry = self.media_dir / 'recordings.json'
        if not registry.exists(): return None
        entry = json.loads(registry.read_text()).get(recording_key(source))
        if not isinstance(entry, dict): return None
        name = entry.get('file')
        offset = entry.get('offset', 0)
        if not isinstance(name, str) or not isinstance(offset, (int, float)) or not math.isfinite(offset) or offset < 0:
            return None
        path = (self.media_dir / name).resolve()
        if path.parent != self.media_dir or not path.is_file(): return None
        duration = entry.get('duration')
        if duration is not None and (not isinstance(duration, (int, float)) or not math.isfinite(duration) or duration <= 0):
            return None
        return path, offset, duration

    def chunk(self, source, start, duration, prompt=PROMPT):
        validate_source(source)
        if isinstance(start, bool) or not isinstance(start, int) or start < 0 or start % CHUNK or start > 86400:
            raise ValueError('分段位置无效')
        if not isinstance(duration, (int, float)) or not math.isfinite(duration) or not 0 < duration <= 86400 or start >= duration:
            raise ValueError('录播时长无效')
        if not isinstance(prompt, str) or len(prompt) > 800:
            raise ValueError('术语提示太长')
        key = cache_key(source, self.model_id, prompt, start)
        cached = self.cache / (key + '.json')
        if cached.exists():
            result = json.loads(cached.read_text()); result['cached'] = True; os.utime(cached, None); return result
        if not self.lock.acquire(timeout=130): raise RuntimeError('识别正在处理另一段，请稍后重试')
        try:
            end = min(duration, start + CHUNK)
            offset = max(0, start - 2); length = min(duration - offset, end - offset + 2)
            began = time.monotonic()
            with tempfile.TemporaryDirectory(prefix='icourse-whisper-') as tmp:
                wav = Path(tmp) / 'audio.wav'
                # Seek before input: request only the necessary MP4 ranges where supported.
                clip = self.local_clip(source)
                local = clip[0] if clip else self.local_media(source)
                local_offset = clip[1] if clip else 0
                if local and start < local_offset:
                    raise RuntimeError('当前位置不在导入的测试片段内，请跳到片段开始时间或导入完整录播')
                offset = max(offset, local_offset)
                length = min(duration - offset, end - offset + 2)
                if clip and clip[2] is not None:
                    if end > local_offset + clip[2] + 0.2:
                        raise RuntimeError('当前位置超出本地片段范围，请导入完整录播')
                    length = min(length, local_offset + clip[2] - offset)
                command = [self.ffmpeg, '-nostdin', '-hide_banner', '-loglevel', 'error', *([] if local else ['-tls_verify', '1']), '-rw_timeout', '15000000', '-protocol_whitelist', 'file' if local else 'https,http,tcp,tls,crypto', '-ss', str(offset - local_offset), '-i', str(local) if local else source, '-t', str(length), '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', '-y', str(wav)]
                try: subprocess.run(command, check=True, capture_output=True, timeout=65)
                except (subprocess.CalledProcessError, subprocess.TimeoutExpired): raise RuntimeError('音频预取失败：地址可能已过期或需要浏览器登录；请重新打开课次。可用视频菜单下载录播，将原文件放入配置的本地视频目录后重试。') from None
                # Never mark an incomplete download or an out-of-range clip as ready.
                import wave
                with wave.open(str(wav), 'rb') as audio:
                    actual = audio.getnframes() / audio.getframerate()
                if actual < length - 0.2:
                    raise RuntimeError('本地片段未覆盖当前位置，请导入完整录播或跳回测试片段范围')
                body, content_type = multipart(wav.read_bytes(), prompt)
                req = Request(self.inference, data=body, headers={'Content-Type': content_type})
                try:
                    with urlopen(req, timeout=120) as response: decoded = json.load(response)
                except Exception: raise RuntimeError('Whisper 推理失败，请查看本地服务日志') from None
            elapsed = time.monotonic() - began
            self.last_rtf = elapsed / (end - start)
            result = {'start': start, 'end': end, 'cues': normalize_segments(decoded.get('segments', []), offset, start, end), 'seconds': round(elapsed, 3), 'rtf': round(self.last_rtf, 3), 'cached': False}
            temporary = cached.with_suffix('.tmp'); temporary.write_text(json.dumps(result, ensure_ascii=False)); temporary.replace(cached)
            # Bounded persistent cache: roughly 10 hours of subtitle chunks, no media.
            entries = sorted(self.cache.glob('*.json'), key=lambda p: p.stat().st_mtime)
            for old in entries[:-1800]: old.unlink()
            return result
        finally: self.lock.release()


def handler(engine, token, port):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_): pass  # Never log signed URLs or authorization.
        def send(self, status, value):
            body = json.dumps(value, ensure_ascii=False).encode()
            self.send_response(status); self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(body))); self.end_headers()
            try: self.wfile.write(body)
            except (BrokenPipeError, ConnectionResetError): pass
        def authorized(self):
            origin = self.headers.get('Origin', '')
            return self.headers.get('Host') == f'127.0.0.1:{port}' and (not origin or origin.startswith('chrome-extension://')) and hmac.compare_digest(self.headers.get('Authorization', ''), 'Bearer ' + token)
        def do_GET(self):
            if not self.authorized(): return self.send(403, {'error': '本地连接密钥无效'})
            if self.path != '/health': return self.send(404, {'error': '未知请求'})
            self.send(200, {'model': engine.model.name, 'chunkSeconds': CHUNK, 'rtf': engine.last_rtf})
        def do_POST(self):
            if not self.authorized(): return self.send(403, {'error': '本地连接密钥无效'})
            if self.path != '/chunk': return self.send(404, {'error': '未知请求'})
            try:
                size = int(self.headers.get('Content-Length', '0'))
                if not 0 < size <= 16384: raise ValueError('请求大小无效')
                data = json.loads(self.rfile.read(size))
                result = engine.chunk(data.get('source'), data.get('start'), data.get('duration'), data.get('prompt', PROMPT))
                self.send(200, result)
            except (ValueError, TypeError, json.JSONDecodeError) as error: self.send(400, {'error': str(error)})
            except RuntimeError as error: self.send(503, {'error': str(error)})
            except Exception: self.send(500, {'error': '本地识别失败，请查看服务配置'})
    return Handler


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', required=True); parser.add_argument('--state-dir', required=True)
    parser.add_argument('--vad-model', required=True, help='官方 Silero VAD GGML 模型')
    parser.add_argument('--media-dir', help='仅按录播原始文件名匹配该目录中的 MP4，不扫描其他目录')
    parser.add_argument('--port', type=int, default=8766); parser.add_argument('--engine-port', type=int, default=8767)
    parser.add_argument('--whisper-server', default=shutil.which('whisper-server')); parser.add_argument('--ffmpeg', default=shutil.which('ffmpeg'))
    args = parser.parse_args()
    if not args.whisper_server or not args.ffmpeg: parser.error('需要 whisper-server 和 ffmpeg')
    state = Path(args.state_dir); state.mkdir(parents=True, exist_ok=True); state.chmod(0o700)
    token_file = state / 'connection-key.txt'
    if not token_file.exists(): token_file.write_text(secrets.token_urlsafe(32))
    token_file.chmod(0o600); token = token_file.read_text().strip()
    nonce = secrets.token_hex(24)
    log = (state / 'engine.log').open('a')
    def interrupted(*_): raise KeyboardInterrupt
    signal.signal(signal.SIGTERM, interrupted)
    process = subprocess.Popen([args.whisper_server, '-m', args.model, '--host', '127.0.0.1', '--port', str(args.engine_port), '--request-path', '/' + nonce, '-l', 'zh', '-fa', '--vad', '-vm', args.vad_model, '-vp', '200', '-vsd', '500', '-bs', '5'], stdout=log, stderr=log)
    try:
        endpoint = f'http://127.0.0.1:{args.engine_port}/{nonce}'
        for _ in range(120):
            if process.poll() is not None: raise RuntimeError('Whisper 引擎启动失败，见 engine.log')
            try:
                with urlopen(endpoint + '/', timeout=1): break
            except Exception: time.sleep(0.5)
        else: raise RuntimeError('Whisper 模型启动超时')
        engine = Engine(args.model, state / 'cache', endpoint + '/inference', args.ffmpeg, args.media_dir)
        print(f'本地字幕服务已就绪：http://127.0.0.1:{args.port}；连接密钥文件：{token_file}', flush=True)
        ThreadingHTTPServer(('127.0.0.1', args.port), handler(engine, token, args.port)).serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        process.terminate()
        try: process.wait(timeout=5)
        except subprocess.TimeoutExpired: process.kill(); process.wait()
        log.close()

if __name__ == '__main__': main()
