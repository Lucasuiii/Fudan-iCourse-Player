#!/usr/bin/env python3
"""Explicit, bounded cloud benchmark; never called by the player or local server."""
import argparse
import base64
import hashlib
import json
from pathlib import Path
import subprocess
import time
import uuid
import wave
import requests

BASE = 'https://openspeech.bytedance.com/api/v3/auc/bigmodel'
RESOURCE = 'volc.seedasr.auc'

def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    tmp=path.with_suffix('.tmp');tmp.write_text(json.dumps(value,ensure_ascii=False,indent=2));tmp.chmod(0o600);tmp.replace(path)

def recognize(audio, key_file, output):
    with wave.open(str(audio),'rb') as f:
        seconds=f.getnframes()/f.getframerate()
    if not 0 < seconds <= 1800.01:raise ValueError('Benchmark upload is limited to 30 minutes')
    identity=hashlib.sha256(audio.read_bytes()).hexdigest()
    task=output.with_suffix('.task.json')
    if output.exists():
        previous=json.loads(output.read_text())
        if previous['metadata']['audio_sha256']!=identity:raise ValueError('Reference belongs to different audio')
        return previous
    if task.exists():
        state=json.loads(task.read_text())
        if state['audio_sha256']!=identity:raise ValueError('Existing task belongs to different audio')
        if state['state']!='submitted':raise RuntimeError('Submission was rejected or uncertain; inspect private task before retrying')
    else:
        encoded=subprocess.run(['ffmpeg','-nostdin','-v','error','-i',str(audio),'-vn','-ac','1','-ar','16000','-codec:a','libmp3lame','-b:a','48k','-f','mp3','-'],capture_output=True,check=True,timeout=180).stdout
        if not encoded or len(encoded)>20*1024*1024:raise ValueError('Encoded audio exceeds limit')
        state={'audio_sha256':identity,'seconds':seconds,'resource':RESOURCE,'request_id':str(uuid.uuid4()),'state':'submitting'}
        save(task,state) # Persist before POST: a lost response must not trigger a second paid upload.
        headers={'X-Api-Key':key_file.read_text().strip(),'X-Api-Resource-Id':RESOURCE,'X-Api-Request-Id':state['request_id'],'X-Api-Sequence':'-1'}
        payload={'user':{'uid':'icourse-private-benchmark'},'audio':{'format':'mp3','data':base64.b64encode(encoded).decode(),'language':'zh-CN'},'request':{'model_name':'bigmodel','enable_itn':True,'enable_punc':True,'enable_ddc':False,'show_utterances':True}}
        r=requests.post(BASE+'/submit',headers=headers,json=payload,timeout=(15,120))
        code=r.headers.get('X-Api-Status-Code','unavailable')
        if r.status_code!=200 or code!='20000000':
            state.update(state='rejected',http_status=r.status_code,status_code=code);save(task,state)
            raise RuntimeError(f'Doubao rejected submission: HTTP {r.status_code}, status {code}')
        state['state']='submitted';save(task,state)
        print('Submitted one authorized 30-minute recording',flush=True)
    headers={'X-Api-Key':key_file.read_text().strip(),'X-Api-Resource-Id':RESOURCE,'X-Api-Request-Id':state['request_id']}
    deadline=time.monotonic()+900
    while time.monotonic()<deadline:
        r=requests.post(BASE+'/query',headers=headers,json={},timeout=(15,60))
        code=r.headers.get('X-Api-Status-Code','unavailable')
        if r.status_code!=200:raise RuntimeError(f'Doubao query HTTP {r.status_code}')
        if code in ('20000001','20000002'):time.sleep(5);continue
        if code!='20000000':raise RuntimeError(f'Doubao query status {code}')
        result={'metadata':state,'response':r.json()};save(output,result)
        print('Reference saved privately',flush=True);return result
    raise RuntimeError('Query timed out; run again to resume polling without uploading again')

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--audio',type=Path,required=True);p.add_argument('--key-file',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
    a=p.parse_args()
    try:recognize(a.audio,a.key_file,a.output)
    except requests.RequestException:raise SystemExit('Doubao transport failed; private task prevents automatic duplicate upload') from None
    except RuntimeError as e:raise SystemExit(str(e)) from None

if __name__=='__main__':main()
