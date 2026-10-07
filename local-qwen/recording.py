"""Qwen loopback authentication, stable recording identity and local media lookup."""
import hashlib
import hmac
import json
import math
from pathlib import Path
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlsplit, unquote
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


class RecordingMedia:
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

