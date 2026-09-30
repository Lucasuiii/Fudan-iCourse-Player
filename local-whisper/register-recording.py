#!/usr/bin/env python3
"""Register a downloaded authorized recording or clip without retaining its signed URL."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
spec = importlib.util.spec_from_file_location('service', Path(__file__).with_name('service.py'))
s = importlib.util.module_from_spec(spec); spec.loader.exec_module(s)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url-file', required=True, help='包含浏览器视频地址的本地文本文件，不会复制或打印签名')
    parser.add_argument('--file', required=True, help='已获得授权的本地视频或 WAV 音频')
    parser.add_argument('--offset', type=float, default=0, help='裁切片段在原始录播中的起始秒数')
    parser.add_argument('--state-dir', default=os.environ.get('ICOURSE_WHISPER_HOME', str(Path.home() / 'Library/Application Support/iCourseWhisper')))
    args = parser.parse_args()
    if not 0 <= args.offset <= 86400: parser.error('offset 超出范围')
    source = Path(args.url_file).read_text().strip()
    key = s.recording_key(source)
    audio = Path(args.file)
    if not audio.is_file() or audio.suffix.lower() not in ('.mp4', '.wav'): parser.error('需要本地 MP4 / WAV 文件')
    probe = shutil.which('ffprobe')
    if not probe: parser.error('需要 ffprobe（随 ffmpeg 安装）')
    duration = float(subprocess.check_output([probe, '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', str(audio)], timeout=30).decode().strip())
    media = Path(args.state_dir) / 'media'; media.mkdir(parents=True, exist_ok=True); media.chmod(0o700)
    destination = media / (key + audio.suffix.lower())
    if destination.resolve() != audio.resolve(): shutil.copyfile(audio, destination)
    destination.chmod(0o600)
    registry = media / 'recordings.json'
    values = json.loads(registry.read_text()) if registry.exists() else {}
    values[key] = {'file': destination.name, 'offset': args.offset, 'duration': duration}
    temporary = registry.with_suffix('.tmp'); temporary.write_text(json.dumps(values)); temporary.chmod(0o600); temporary.replace(registry)
    print('本地录播已注册；原始录播起点：' + str(args.offset) + ' 秒。')

if __name__ == '__main__': main()
