#!/usr/bin/env python3
"""Run Qwen 1.7B/8-bit on a user-authorized local WAV and measure prefetch/cache."""
import argparse
import importlib.metadata
import json
from pathlib import Path
import statistics
import time
from window_cache import WindowCache, digest_file


def simulate(seconds, window, rate, horizon=100):
    # Wait for the first window, then play while sequential prefetch computes.
    ready = seconds[0]; timeline = []
    for index, elapsed in enumerate(seconds):
        if index:
            eligible = seconds[0] + max(0, index * window - horizon) / rate
            ready = max(ready, eligible) + elapsed
        deadline = seconds[0] + index * window / rate
        timeline.append(max(0, ready - deadline))
    return {'rate': rate, 'late_windows_after_start': sum(delay > 0.001 for delay in timeline[1:]),
            'max_lateness_seconds': round(max(timeline[1:], default=0), 3)}


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--audio', type=Path, required=True)
    p.add_argument('--model', type=Path, required=True)
    p.add_argument('--state', type=Path, default=Path.home()/'Library/Application Support/iCourseQwen')
    p.add_argument('--offset', type=float, default=0)
    p.add_argument('--position', type=float, required=True)
    p.add_argument('--windows', type=int, default=10)
    p.add_argument('--terms', default='')
    args = p.parse_args()
    if not 1 <= args.windows <= 90: p.error('windows must be between 1 and 90')
    began_total = time.perf_counter()
    from mlx_qwen3_asr import Session
    import mlx.core as mx
    import numpy as np
    args.state.mkdir(parents=True, exist_ok=True, mode=0o700)
    model_id = ':'.join(digest_file(args.model/name) for name in ['model.safetensors', 'config.json', 'tokenizer_config.json']) + ':Chinese:512:' + importlib.metadata.version('mlx-qwen3-asr')
    session = None
    load_seconds = 0
    def infer(pcm, context):
        nonlocal session, load_seconds
        if session is None:
            began=time.perf_counter(); session=Session(model=str(args.model));load_seconds=time.perf_counter()-began
            # Verify actual loaded decoder quantization, rather than trusting the model name.
            bits = {module.bits for name, module in session.model.named_modules() if hasattr(module, 'bits')}
            if bits != {8}:
                raise RuntimeError('Loaded quantized modules are not uniformly 8-bit')
            print(json.dumps({'event':'model_loaded','bits':sorted(bits),'seconds':round(load_seconds,3)}),flush=True)
        audio=np.frombuffer(pcm,dtype='<i2').astype(np.float32)/32768
        result=session.transcribe((audio,16000),language='Chinese',context=context,max_new_tokens=512)
        return {'text':result.text,'truncated':result.truncated}
    cache=WindowCache(args.audio,args.state/'window-cache',infer,model_id,context=args.terms,offset=args.offset)
    base = cache.plan(args.position, 0)[0]
    starts=[]
    for index in range(args.windows):
        start=base+index*20
        if start >= args.offset+cache.duration:break
        starts.append(start)
    setup_seconds = time.perf_counter() - began_total
    results=[]
    for start in starts:
        r=cache.get(start);results.append(r)
        print(json.dumps({'event':'window','start':start,'seconds':round(r['seconds'],3),'cached':r['cached'],'chars':len(r['text'])}),flush=True)
    if not results: p.error('position is outside the imported recording')
    hits=[cache.get(start) for start in starts]
    seconds=[r['seconds'] for r in results]
    if results[0]['cached']:
        warm=[]
    else:
        warm=[r['seconds'] for r in results[1:] if not r['cached']]
    summary={'model':'Qwen3-ASR-1.7B-8bit','runtime':importlib.metadata.version('mlx-qwen3-asr'),
             'setup_seconds':setup_seconds,'first_ready_seconds':setup_seconds + seconds[0],
             'load_seconds':load_seconds,'windows':len(results),'media_seconds':sum(r['end']-r['start'] for r in results),
             'cold_windows':sum(not r['cached'] for r in results),'total_seconds':sum(seconds),
             'warm_median_seconds':statistics.median(warm) if warm else None,
             'warm_max_seconds':max(warm) if warm else None,'cache_max_seconds':max(r['seconds'] for r in hits),
             'peak_gpu_gib':mx.get_peak_memory()/1024**3,
             'real_time_factor':sum(seconds)/sum(r['end']-r['start'] for r in results),
             'simulation':[simulate(seconds,20,rate) for rate in [1,1.5,2]],
             'boundary':'Window text includes overlap. No word alignment, accuracy ground truth or browser end-to-end test.'}
    report={'summary':summary,'results':results}
    destination=args.state/'pilot-results.json'
    destination.write_text(json.dumps(report,ensure_ascii=False,indent=2));destination.chmod(0o600)
    print(json.dumps({'event':'summary',**summary}),flush=True)

if __name__=='__main__':main()
