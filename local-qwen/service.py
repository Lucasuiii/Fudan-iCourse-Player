#!/usr/bin/env python3
"""Authenticated Qwen recording-window service, with local VAD and word alignment."""
import argparse
import hashlib
import importlib.util
import io
import json
import math
import re
from pathlib import Path
import secrets
import signal
import shutil
import subprocess
import tempfile
import threading
import time
import wave
from http.server import ThreadingHTTPServer
from window_cache import WindowCache, digest_file
from temporary_media import TemporaryMedia

import recording as legacy


def audio_read_error(stderr):
    """Expose a useful category without logging URLs, tokens or response bodies."""
    text=stderr.decode('utf-8',errors='replace').lower()
    if any(s in text for s in ('certificate verify failed','certificate verification failed','unable to get local issuer','peer certificate')):
        return '读取录播失败：TLS 证书验证失败，请检查本地 CA 配置'
    code=re.search(r'\b(401|403|404|410)\b',text)
    if code:return '读取录播失败：HTTP '+code[1]+'，请重新选择课次刷新播放地址'
    if any(s in text for s in ('timed out','timeout')):return '读取录播失败：网络连接超时，请检查校园网或 VPN'
    if any(s in text for s in ('failed to resolve','name or service not known','nodename nor servname')):return '读取录播失败：无法解析课程服务器地址'
    if any(s in text for s in ('connection refused','network is unreachable','no route to host')):return '读取录播失败：无法连接课程服务器，请检查校园网或 VPN'
    if any(s in text for s in ('invalid data found','moov atom not found')):return '读取录播失败：服务器没有返回可解码的 MP4 音频'
    return '读取录播失败：音频下载或解码失败，请重新选择课次后重试'


def remote_input_options(source):
    host=legacy.validate_source(source).hostname
    import certifi
    return ['-tls_verify','1','-ca_file',certifi.where(),
            '-user_agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
            '-referer','https://'+host+'/',
            '-reconnect','1','-reconnect_on_network_error','1','-reconnect_max_retries','2','-reconnect_delay_total_max','5']


def owned_words(words, offset, start, end):
    selected=[]
    for w in words:
        a,b=float(w['start'])+offset,float(w['end'])+offset
        text=str(w['text']).strip()
        if text and math.isfinite(a+b) and b>=a and start<=(a+b)/2<end:
            selected.append({'start':max(start,a),'end':min(end,max(a+0.02,b)),'text':text})
    return sorted(selected,key=lambda w:w['start'])


def caption_text(words):
    text=''
    previous=''
    for w in words:
        current=w['text']
        # Whole English words need spaces; aligned character fragments do not.
        space=' ' if (re.search(r'[A-Za-z0-9]$',previous) and re.match(r'[A-Za-z0-9]',current)
            and (len(previous)>1 or len(current)>1)) else ''
        text+=space+current
        previous=current
    return text


def group_words(words, offset, start, end):
    """Backtrack to a natural boundary before enforcing readability limits."""
    selected=owned_words(words,offset,start,end)
    cues=[]
    pending=[]
    strong=r'[。！？!?；;][”’」』）)"]*$'
    punctuation=r'^[，。！？、：；,.!?;:）)”’」』"]'
    def emit(count):
        nonlocal pending
        part=pending[:count]
        cues.append({'start':part[0]['start'],'end':max(w['end'] for w in part),'text':caption_text(part)})
        pending=pending[count:]
    def natural_cut():
        best=None
        for i in range(1,len(pending)):
            before=caption_text(pending[:i])
            after=caption_text(pending[i:])
            if len(before)<8 or len(after)<6 or re.match(punctuation,after):continue
            gap=pending[i]['start']-pending[i-1]['end']
            score=60 if re.search(r'[，,：:]$',before) else 35 if gap>=0.18 else 0
            if not score and re.match(r'但是|所以|然后|不过|因此|接下来|另外|也就是说',after):score=25
            if score:
                score-=abs(len(before)-24)*0.4
                if best is None or score>best[0]:best=(score,i)
        return best[1] if best else len(pending)
    for w in selected:
        if pending and not re.match(punctuation,w['text']):
            text=caption_text(pending)
            gap=w['start']-max(x['end'] for x in pending)
            if re.search(strong,text) or gap>0.6 or (len(text)>=12 and
                (re.search(r'[，,：:]$',text) or gap>0.35)):
                emit(len(pending))
            elif len(caption_text(pending+[w]))>36 or w['end']-pending[0]['start']>8:
                emit(natural_cut())
                # A remaining clause can itself exceed the safety limit.
                if pending and (len(caption_text(pending+[w]))>36 or w['end']-pending[0]['start']>8):emit(len(pending))
        pending.append(w)
    if pending:emit(len(pending))
    if len(cues)>1:
        prev,last=cues[-2:]
        if len(last['text'])<6 and len(prev['text'])+len(last['text'])<=40 and last['end']-prev['start']<=9 and last['start']-prev['end']<=0.35 and not re.search(strong,prev['text']):
            prev['text']=caption_text([prev,last]);prev['end']=max(prev['end'],last['end']);cues.pop()
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


class Engine(legacy.RecordingMedia):
    def __init__(self, model, aligner, vad, cache, media_dir, ffmpeg):
        import mlx.core as mx
        from mlx_qwen3_asr import Session
        from mlx_qwen3_asr.forced_aligner import ForcedAligner
        self.model=Path(model);self.cache=Path(cache);self.media_dir=Path(media_dir).resolve()
        self.cache.mkdir(parents=True,exist_ok=True,mode=0o700)
        if not ffmpeg:raise RuntimeError('请先安装 ffmpeg')
        self.ffmpeg=ffmpeg;self.lock=threading.Lock();self.last_rtf=None;self.media=TemporaryMedia()
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

    def cached_chunk(self, source, start, duration, prompt=''):
        legacy.validate_source(source)
        if isinstance(start,bool) or not isinstance(start,int) or start<0 or start%20 or start>86400:raise ValueError('分段位置无效')
        if isinstance(duration,bool) or not isinstance(duration,(int,float)) or not math.isfinite(duration) or not start<duration<=86400:raise ValueError('录播时长无效')
        if not isinstance(prompt,str) or len(prompt)>800:raise ValueError('术语提示太长')
        path=self.cache/(legacy.cache_key(source,self.model_id,prompt,start)+'.json')
        if not path.exists():return None
        try:
            result=json.loads(path.read_text())
            if result['start']!=start or result['end']!=min(duration,start+20) or not isinstance(result['words'],list):return None
            result['cues']=group_words(result['words'],result['audio_start'],start,result['end'])
            result['alignedWords']=owned_words(result['words'],result['audio_start'],start,result['end'])
            return {**result,'cached':True,'seconds':0}
        except (ValueError,KeyError,TypeError):return None

    def export_captions(self, source, duration, prompt=''):
        self.cached_chunk(source,0,duration,prompt) # Validate before planning any disk reads.
        windows=[]
        for start in range(0,math.ceil(duration),20):
            result=self.cached_chunk(source,start,duration,prompt)
            if result is not None:
                windows.append({k:result[k] for k in ('start','end','cues','alignedWords')})
        return {'windows':windows,'completed':len(windows),'total':math.ceil(duration/20)}

    def chunk(self, source, start, duration, prompt='', relay_id=None, owner=None):
        cached=self.cached_chunk(source,start,duration,prompt)
        if cached is not None:return cached
        if not self.lock.acquire(timeout=120):raise RuntimeError('Qwen 正忙，请稍后重试')
        began=time.monotonic()
        try:
            clip=usable_clip(self.local_clip(source),start,min(duration,start+20))
            if clip and clip[0].suffix.lower()=='.wav':
                cache=WindowCache(clip[0],self.cache,self.infer,self.model_id,context=prompt,offset=clip[1],limit=None)
                result=cache.get(start)
            else:
                key=legacy.cache_key(source,self.model_id,prompt,start)
                destination=self.cache/(key+'.json')
                offset=max(0,start-2);end=min(duration,start+20);length=min(duration,end+2)-offset
                local=clip[0] if clip else self.local_media(source)
                relay=self.media.url(relay_id,owner,legacy.recording_key(source)) if relay_id else None
                if clip:
                    offset=max(offset,clip[1]);length=min(duration,end+2,clip[1]+clip[2] if clip[2] else duration)-offset
                with tempfile.TemporaryDirectory(prefix='icourse-qwen-') as tmp:
                    wav=Path(tmp)/'audio.wav'
                    cmd=[self.ffmpeg,'-nostdin','-v','error',*([] if local or relay else remote_input_options(source)),'-rw_timeout','15000000','-protocol_whitelist','file' if local else 'http,tcp' if relay else 'https,http,tcp,tls,crypto','-ss',str(offset-(clip[1] if clip else 0)),'-i',str(local) if local else relay or source,'-t',str(length),'-vn','-ac','1','-ar','16000','-c:a','pcm_s16le',str(wav)]
                    try:subprocess.run(cmd,check=True,capture_output=True,timeout=65)
                    except subprocess.CalledProcessError as error:
                        message=audio_read_error(error.stderr or b'');print(message,flush=True)
                        raise RuntimeError(message) from None
                    except subprocess.TimeoutExpired:raise RuntimeError('读取录播失败：音频读取超过 65 秒，请检查校园网或 VPN') from None
                    with wave.open(str(wav),'rb') as f:
                        if f.getnframes()/16000 < length-0.1:raise RuntimeError('音频未完整覆盖当前窗口')
                        if relay_id:self.media.phase(relay_id,owner,'recognizing')
                        decoded=self.infer(f.readframes(f.getnframes()),prompt)
                    if decoded['truncated']:raise RuntimeError('模型输出被截断，请重试')
                    result={'start':start,'end':end,'audio_start':offset,'text':decoded['text'],'words':decoded['segments'],'cached':False}
            result['end']=min(duration,start+20)
            result['cues']=group_words(result.get('words',[]),result['audio_start'],start,result['end'])
            result['alignedWords']=owned_words(result.get('words',[]),result['audio_start'],start,result['end'])
            result['recordingId']=legacy.recording_key(source)
            result['timing']='word-aligned'
            destination=self.cache/(legacy.cache_key(source,self.model_id,prompt,start)+'.json')
            temp=destination.with_suffix('.tmp');temp.write_text(json.dumps(result,ensure_ascii=False));temp.chmod(0o600);temp.replace(destination)
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
    p.add_argument('--media-dir',type=Path,default=base/'media')
    p.add_argument('--port',type=int,default=8768)
    args=p.parse_args();args.state_dir.mkdir(parents=True,exist_ok=True,mode=0o700)
    key=args.state_dir/'connection-key.txt'
    if not key.exists():
        old=Path.home()/'Library/Application Support/iCourseWhisper/connection-key.txt'
        key.write_text(old.read_text().strip() if old.exists() else secrets.token_urlsafe(32));key.chmod(0o600)
    engine=Engine(args.model,args.aligner,args.vad,args.state_dir/'aligned-cache',args.media_dir,shutil.which('ffmpeg'))
    parent=legacy.handler(engine,key.read_text().strip(),args.port)
    class Handler(parent):
        def do_POST(self):
            if self.path not in ('/media','/relay-chunk','/cached-chunk','/export-captions'):return super().do_POST()
            if not self.authorized():return self.send(403,{'error':'本地连接密钥无效'})
            try:
                size=int(self.headers.get('Content-Length','0'))
                if not 0<size<=400000:raise ValueError('分段读取请求过大')
                data=json.loads(self.rfile.read(size))
                if not isinstance(data,dict) or not isinstance(data.get('owner'),str):raise ValueError('分段读取请求无效')
                if self.path=='/export-captions':
                    result=engine.export_captions(data.get('source'),data.get('duration'),data.get('prompt',''))
                elif self.path=='/cached-chunk':
                    result=engine.cached_chunk(data.get('source'),data.get('start'),data.get('duration'),data.get('prompt',''))
                elif self.path=='/relay-chunk':
                    if not isinstance(data.get('relayId'),str):raise ValueError('分段读取会话缺失')
                    result=engine.chunk(data.get('source'),data.get('start'),data.get('duration'),data.get('prompt',''),data.get('relayId'),data['owner'])
                else:
                    media_key=legacy.recording_key(data['source']) if data.get('action')=='begin' else None
                    result=engine.media.transfer(data,media_key)
                self.send(200,result)
            except (ValueError,KeyError,TypeError):self.send(400,{'error':'分段读取参数无效或已取消'})
            except RuntimeError as error:self.send(503,{'error':str(error)})
            except Exception:self.send(500,{'error':'本地窗口识别失败'})
    server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    def expire():
        while True:time.sleep(60);engine.media.cleanup()
    threading.Thread(target=expire,daemon=True).start()
    print('Qwen BF16 缓存字幕服务就绪：127.0.0.1:'+str(args.port),flush=True)
    def terminate(*_):raise SystemExit(0)
    signal.signal(signal.SIGTERM,terminate)
    try:server.serve_forever()
    finally:server.server_close();engine.media.close()

if __name__=='__main__':main()
