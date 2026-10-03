#!/usr/bin/env python3
"""Download only the selected ASR checkpoint, outside the extension/repository."""
import argparse
from pathlib import Path
import hashlib
import requests

MODEL = 'mlx-community/Qwen3-ASR-1.7B-bf16'
REVISION = 'e1f6c266914abc5a46e8756e02580f834a6cf8a7'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path, default=Path.home()/'Library/Application Support/iCourseQwen/models/qwen3-asr-1.7b-bf16')
    args = parser.parse_args()
    from huggingface_hub import snapshot_download
    print(snapshot_download(MODEL, revision=REVISION, local_dir=args.destination,
                            allow_patterns=['*.json', '*.txt', '*.safetensors']))
    print(snapshot_download('Qwen/Qwen3-ForcedAligner-0.6B', revision='c7cbfc2048c462b0d63a45797104fc9db3ad62b7',
                            local_dir=args.destination.parent/'qwen3-forced-aligner-0.6b',
                            allow_patterns=['*.json','*.txt','*.safetensors']))
    vad=args.destination.parent/'silero-vad.onnx'
    expected='1a153a22f4509e292a94e67d6f9b85e8deb25b4988682b7e174c65279d8788e3'
    if not vad.exists() or hashlib.sha256(vad.read_bytes()).hexdigest()!=expected:
        r=requests.get('https://raw.githubusercontent.com/snakers4/silero-vad/1e261b036686cd0017d500ee96acd1c4ba572a9d/src/silero_vad/data/silero_vad.onnx',timeout=120)
        r.raise_for_status()
        if hashlib.sha256(r.content).hexdigest()!=expected:raise RuntimeError('VAD checksum mismatch')
        vad.write_bytes(r.content)
    print(vad)


if __name__ == '__main__': main()
