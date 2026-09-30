#!/usr/bin/env python3
"""Install fixed official sherpa-onnx resources; never downloads course audio."""
import hashlib
import subprocess
import tarfile
import tempfile
from pathlib import Path

URL = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.12.20/sherpa-onnx-wasm-simd-v1.12.20-zh-en-asr-zipformer.tar.bz2'
SHA256 = 'e889207cd6a84973cbc028c05115cdd778ae8e277867b83169644be5b3a63c53'
FILES = ['sherpa-onnx-wasm-main-asr.data', 'sherpa-onnx-wasm-main-asr.wasm']

def main():
    destination = Path(__file__).resolve().parents[1] / 'vendor' / 'sherpa'
    destination.mkdir(parents=True, exist_ok=True)
    print('Downloading official Chinese/English streaming resources (~182 MB).')
    with tempfile.TemporaryDirectory(prefix='icourse-asr-') as temp:
        archive = Path(temp) / 'model.tar.bz2'
        subprocess.run(['curl', '-fL', '--retry', '2', '--connect-timeout', '15', '--max-time', '600', URL, '-o', str(archive)], check=True)
        with archive.open('rb') as source:
            actual_hash = hashlib.file_digest(source, 'sha256').hexdigest()
        if actual_hash != SHA256:
            raise RuntimeError('Archive checksum mismatch; no resources installed')
        with tarfile.open(archive) as tar:
            for filename in FILES:
                members = [m for m in tar.getmembers() if Path(m.name).name == filename and m.isfile()]
                if len(members) != 1:
                    raise RuntimeError('Unexpected archive contents')
                body = tar.extractfile(members[0]).read()
                temporary = destination / (filename + '.tmp')
                temporary.write_bytes(body)
                temporary.replace(destination / filename)
    print('Installed. Reload the extension and refresh the course page.')

if __name__ == '__main__':
    main()
