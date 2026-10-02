#!/usr/bin/env python3
"""Download only the selected ASR checkpoint, outside the extension/repository."""
import argparse
from pathlib import Path

MODEL = 'mlx-community/Qwen3-ASR-1.7B-8bit'
REVISION = 'a8379a2e2f9e313c9292cdf1af4055ab56d50d55'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path, default=Path.home()/'Library/Application Support/iCourseQwen/models/qwen3-asr-1.7b-8bit')
    args = parser.parse_args()
    from huggingface_hub import snapshot_download
    print(snapshot_download(MODEL, revision=REVISION, local_dir=args.destination,
                            allow_patterns=['*.json', '*.txt', '*.safetensors']))


if __name__ == '__main__': main()
