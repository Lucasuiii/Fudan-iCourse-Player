#!/usr/bin/env python3
"""Download the pinned official whisper.cpp model and verify SHA-256."""
import hashlib
import os
from pathlib import Path
import subprocess

NAME = 'ggml-large-v3-turbo.bin'
REVISION = '5359861c739e955e79d9a303bcbc70fb988958b1'
SHA256 = '1fc70f774d38eb169993ac391eea357ef47c88757ef72ee5943879b7e8e2bc69'
URL = f'https://huggingface.co/ggerganov/whisper.cpp/resolve/{REVISION}/{NAME}'

def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for data in iter(lambda: f.read(4 * 1024 * 1024), b''): h.update(data)
    return h.hexdigest()

def main():
    home = Path(os.environ.get('ICOURSE_WHISPER_HOME', Path.home() / 'Library/Application Support/iCourseWhisper'))
    folder = home / 'models'; folder.mkdir(parents=True, exist_ok=True)
    models = [(NAME, URL, SHA256), (
        'ggml-silero-v6.2.0.bin',
        'https://huggingface.co/ggml-org/whisper-vad/resolve/9ffd54a1e1ee413ddf265af9913beaf518d1639b/ggml-silero-v6.2.0.bin',
        '2aa269b785eeb53a82983a20501ddf7c1d9c48e33ab63a41391ac6c9f7fb6987')]
    for name, url, expected in models:
        target = folder / name
        if target.exists() and digest(target) == expected:
            print(name + ' 已安装且校验通过'); continue
        temporary = target.with_suffix('.download')
        print('下载 ' + name + '，完成后校验 SHA-256。', flush=True)
        subprocess.run(['curl', '--fail', '--location', '--retry', '3', '--continue-at', '-', '--output', str(temporary), url], check=True)
        if digest(temporary) != expected:
            temporary.unlink()
            raise RuntimeError('模型校验失败，已移除本次下载，请重试')
        temporary.replace(target)
        print('模型安装完成：' + str(target))

if __name__ == '__main__': main()
