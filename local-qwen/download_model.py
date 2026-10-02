#!/usr/bin/env python3
"""Download only the selected ASR checkpoint, outside the extension/repository."""
import argparse
from pathlib import Path

MODEL = 'mlx-community/Qwen3-ASR-1.7B-bf16'
REVISION = 'e1f6c266914abc5a46e8756e02580f834a6cf8a7'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path, default=Path.home()/'Library/Application Support/iCourseQwen/models/qwen3-asr-1.7b-bf16')
    args = parser.parse_args()
    from huggingface_hub import snapshot_download
    print(snapshot_download(MODEL, revision=REVISION, local_dir=args.destination,
                            allow_patterns=['*.json', '*.txt', '*.safetensors']))


if __name__ == '__main__': main()
