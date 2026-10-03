#!/usr/bin/env python3
"""Authenticated Qwen recording-window service, with local VAD and word alignment."""
import argparse
import hashlib
import importlib.util
import io
import json
import math
from pathlib import Path
import secrets
import shutil
import subprocess
import tempfile
import threading
import time
import wave
from http.server import ThreadingHTTPServer
from window_cache import WindowCache, digest_file

spec = importlib.util.spec_from_file_location('whisper_broker', Path(__file__).parent.parent/'local-whisper/service.py')
legacy = importlib.util.module_from_spec(spec); spec.loader.exec_module(legacy)


def group_words(words, offset, start, end):
    """Assign each aligned word once by midpoint; group into short readable cues."""
    selected = []
    for w in words:
        a, b = float(w['start']) + offset, float(w['end']) + offset
        text = str(w['text']).strip()
        if text and math.isfinite(a+b) and b >= a and start <= (a+b)/2 < end:
            selected.append({'start':max(start,a),'end':min(end,max(a+0.02,b)), 'text':text})
    selected.sort(key=lambda w:w['start'])
    cues = []
    for w in selected:
        if not cues or len(cues[-1]['text']) >= 22 or w['start']-cues[-1]['end'] > 0.6 or w['end']-cues[-1]['start'] > 5:
            cues.append(dict(w))
        else:
            prev=cues[-1]
            space=' ' if prev['text'][-1:].isascii() and w['text'][:1].isascii() else ''
            prev['text']+=space+w['text'];prev['end']=max(prev['end'],w['end'])
    return cues


class SpeechGate:
    def __init__(self, model):
        import onnxruntime as ort
        options=ort.SessionOptions();options.intra_op_num_threads=1;options.inter_op_num_threads=1
        self.session=ort.InferenceSession(str(model),sess_options=options,providers=['CPUExecutionProvider'])

    def speech(self, audio):
        import numpy as np
        state=np.zeros((2,1,128),dtype=np.float32);context=np.zeros((1,64),dtype=np.float32)
        positive=0
        for i in range(0,len(audio),512):
            frame=np.pad(audio[i:i+512],(0,max(0,512-len(audio[i:i+512])))).reshape(1,512)
            out,state=self.session.run(None,{'input':np.concatenate([context,frame],axis=1),'state':state,'sr':np.array(16000,dtype=np.int64)})
            context=frame[:,-64:]
            positive+=float(out[0][0])>=0.5
        return positive*512/16000 >= 0.2


def usable_clip(clip, start, end):
    """An imported excerpt is a local optimization, not a whole-recording override."""
    if not clip:return None
    path,offset,duration=clip
    if start < offset:return None
    if path.suffix.lower()=='.wav':
        with wave.open(str(path),'rb') as f:
            actual=f.getnframes()/f.getframerate()
        duration=actual if duration is None else min(duration,actual)
    if duration is not None and end > offset+duration+0.01:return None
    return path,offset,duration


class Engine(legacy.Engine):
    def __init__(self, model, aligner, vad, cache, media_dir, ffmpeg):
        import mlx.core as mx
        from mlx_qwen3_asr import Session
        from mlx_qwen3_asr.forced_aligner import ForcedAligner
        self.model=Path(model);self.cache=Path(cache);self.media_dir=Path(media_dir).resolve()
        self.cache.mkdir(parents=True,exist_ok=True,mode=0o700)
        if not ffmpeg:raise RuntimeError('请先安装 ffmpeg')
        self.ffmpeg=ffmpeg;self.lock=threading.Lock();self.last_rtf=None
        self.session=Session(model=str(model),dtype=mx.bfloat16)
        if any(hasattr(m,'bits') for _,m in self.session.model.named_modules()):
            raise RuntimeError('Qwen 服务要求未量化原版')
        self.aligner=ForcedAligner(model_path=str(aligner),dtype=mx.bfloat16)
        self.gate=SpeechGate(vad)
        self.model_id=':'.join(digest_file(p) for p in [Path(model)/'model.safetensors',Path(model)/'config.json',Path(model)/'tokenizer_config.json',Path(aligner)/'model.safetensors',Path(vad)])+':bf16:Chinese:512:aligned-vad-v1'

    def infer(self, pcm, prompt):
        import numpy as np
        audio=np.frombuffer(pcm,dtype='<i2').astype(np.float32)/32768
        if not self.gate.speech(audio):return {'text':'','segments':[],'truncated':False}
        result=self.session.transcribe((audio,16000),language='Chinese',context=prompt,max_new_tokens=512,return_timestamps=True,forced_aligner=self.aligner)
        return {'text':result.text,'segments':result.segments or [],'truncated':result.truncated}

    def stream(self, *_):raise RuntimeError('Qwen 缓存模式只支持录播，请选择 Qwen 录播缓存')

    def chunk(self, source, start, duration, prompt=''):
        legacy.validate_source(source)
        if isinstance(start,bool) or not isinstance(start,int) or start < 0 or start%20 or start > 86400:
            raise ValueError('分段位置无效')
        if isinstance(duration,bool) or not isinstance(duration,(int,float)) or not math.isfinite(duration) or not start < duration <= 86400:
            raise ValueError('录播时长无效')
        if not isinstance(prompt,str) or len(prompt)>800:raise ValueError('术语提示太长')
        if not self.lock.acquire(timeout=120):raise RuntimeError('Qwen 正忙，请稍后重试')
        began=time.monotonic()
        try:
            clip=usable_clip(self.local_clip(source),start,min(duration,start+20))
            if clip and clip[0].suffix.lower()=='.wav':
                cache=WindowCache(clip[0],self.cache,self.infer,self.model_id,context=prompt,offset=clip[1])
                result=cache.get(start)
            else:
                key=legacy.cache_key(source,self.model_id,prompt,start)
                destination=self.cache/(key+'.json')
                if destination.exists():
                    result=json.loads(destination.read_text());result['cached']=True
                    return result
                offset=max(0,start-2);end=min(duration,start+20);length=min(duration,end+2)-offset
                local=clip[0] if clip else self.local_media(source)
                if clip:
                    offset=max(offset,clip[1]);length=min(duration,end+2,clip[1]+clip[2] if clip[2] else duration)-offset
                with tempfile.TemporaryDirectory(prefix='icourse-qwen-') as tmp:
                    wav=Path(tmp)/'audio.wav'
                    cmd=[self.ffmpeg,'-nostdin','-v','error',*([] if local else ['-tls_verify','1']),'-rw_timeout','15000000','-protocol_whitelist','file' if local else 'https,http,tcp,tls,crypto','-ss',str(offset-(clip[1] if clip else 0)),'-i',str(local) if local else source,'-t',str(length),'-vn','-ac','1','-ar','16000','-c:a','pcm_s16le',str(wav)]
                    try:subprocess.run(cmd,check=True,capture_output=True,timeout=65)
                    except (subprocess.CalledProcessError,subprocess.TimeoutExpired):raise RuntimeError('无法读取录播音频；可先导入有权限下载的视频或音频') from None
                    with wave.open(str(wav),'rb') as f:
                        if f.getnframes()/16000 < length-0.1:raise RuntimeError('音频未完整覆盖当前窗口')
                        decoded=self.infer(f.readframes(f.getnframes()),prompt)
                    if decoded['truncated']:raise RuntimeError('模型输出被截断，请重试')
                    result={'start':start,'end':end,'audio_start':offset,'text':decoded['text'],'words':decoded['segments'],'cached':False}
                result['cues']=group_words(result['words'],offset,start,end)
                temp=destination.with_suffix('.tmp');temp.write_text(json.dumps(result,ensure_ascii=False));temp.chmod(0o600);temp.replace(destination)
                files=sorted(self.cache.glob('*.json'),key=lambda p:p.stat().st_mtime)
                for old in files[:-1800]:old.unlink()
            result['cues']=group_words(result.get('words',[]),result['audio_start'],start,min(duration,start+20))
            result['seconds']=time.monotonic()-began;self.last_rtf=result['seconds']/20
            return result
        finally:self.lock.release()


def main():
    p=argparse.ArgumentParser()
    base=Path.home()/'Library/Application Support/iCourseQwen'
    p.add_argument('--state-dir',type=Path,default=base)
    p.add_argument('--model',type=Path,default=base/'models/qwen3-asr-1.7b-bf16')
    p.add_argument('--aligner',type=Path,default=base/'models/qwen3-forced-aligner-0.6b')
    p.add_argument('--vad',type=Path,default=base/'models/silero-vad.onnx')
    p.add_argument('--media-dir',type=Path,default=Path.home()/'Library/Application Support/iCourseWhisper/media')
    p.add_argument('--port',type=int,default=8768)
    args=p.parse_args();args.state_dir.mkdir(parents=True,exist_ok=True,mode=0o700)
    key=args.state_dir/'connection-key.txt'
    if not key.exists():
        old=Path.home()/'Library/Application Support/iCourseWhisper/connection-key.txt'
        key.write_text(old.read_text().strip() if old.exists() else secrets.token_urlsafe(32));key.chmod(0o600)
    engine=Engine(args.model,args.aligner,args.vad,args.state_dir/'aligned-cache',args.media_dir,shutil.which('ffmpeg'))
    server=ThreadingHTTPServer(('127.0.0.1',args.port),legacy.handler(engine,key.read_text().strip(),args.port))
    print('Qwen BF16 缓存字幕服务就绪：127.0.0.1:'+str(args.port),flush=True)
    server.serve_forever()

if __name__=='__main__':main()
