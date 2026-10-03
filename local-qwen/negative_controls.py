#!/usr/bin/env python3
"""Known speech-free synthetic controls, deliberately bypassing the cache silence guard."""
import argparse
import json
from pathlib import Path
import time


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--model', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    args = p.parse_args()
    import mlx.core as mx
    import numpy as np
    from mlx_qwen3_asr import Session
    session = Session(model=str(args.model), dtype=mx.bfloat16)
    n = 24 * 16000
    rng = np.random.default_rng(42)
    controls = [('silence', np.zeros(n, dtype=np.float32)),
                ('quiet_white_noise', rng.normal(0, 0.003, n).astype(np.float32)),
                ('tone_440hz', (0.01*np.sin(2*np.pi*440*np.arange(n)/16000)).astype(np.float32))]
    results = []
    for name, audio in controls:
        began = time.perf_counter()
        r = session.transcribe((audio,16000),language='Chinese',
                              context='数值算法 向量 矩阵 正交矩阵 酉矩阵 QR 分解 Householder 变换 Givens 旋转 上三角矩阵',
                              max_new_tokens=512)
        item = {'name':name,'nonempty':bool(r.text.strip()),'text':r.text,
                'truncated':r.truncated,'seconds':time.perf_counter()-began}
        results.append(item)
        print(json.dumps({k:v for k,v in item.items() if k!='text'}),flush=True)
    args.output.parent.mkdir(parents=True,exist_ok=True,mode=0o700)
    args.output.write_text(json.dumps(results,ensure_ascii=False,indent=2));args.output.chmod(0o600)


if __name__=='__main__': main()
