"""Authenticated browser byte-range relay. Media bytes stay in bounded RAM."""
import base64
from collections import OrderedDict
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import re
import secrets
import threading
import time

BLOCK=262144
CACHE_LIMIT=32*1024**2
MAX_FILE=128*1024**3
class TemporaryMedia:
    def __init__(self):
        self.entries={};self.jobs={};self.cache=OrderedDict();self.cache_bytes=0;self.lock=threading.RLock()
        broker=self
        class Relay(BaseHTTPRequestHandler):
            def log_message(self,*_):pass
            def do_HEAD(self):self.read(False)
            def do_GET(self):self.read(True)
            def read(self,body):
                token=self.path.lstrip('/')
                with broker.lock:e=broker.entries.get(token)
                if self.headers.get('Host')!=f'127.0.0.1:{broker.server.server_port}' or not e:
                    self.send_error(404);return
                raw=self.headers.get('Range','bytes=0-');match=re.fullmatch(r'bytes=(\d+)-(\d*)',raw)
                if not match:self.send_error(416);return
                start=int(match[1]);end=min(int(match[2]) if match[2] else e['total']-1,start+BLOCK-1,e['total']-1)
                if not 0<=start<=end:self.send_error(416);return
                try:data=broker.read(token,start,end) if body else b''
                except RuntimeError:self.send_error(410);return
                self.send_response(206 if body else 200);self.send_header('Accept-Ranges','bytes');self.send_header('Content-Type','video/mp4')
                if body:self.send_header('Content-Range',f"bytes {start}-{end}/{e['total']}")
                self.send_header('Content-Length',str(end-start+1 if body else e['total']));self.end_headers()
                if body:
                    try:self.wfile.write(data)
                    except (BrokenPipeError,ConnectionResetError):pass
        self.server=ThreadingHTTPServer(('127.0.0.1',0),Relay)
        threading.Thread(target=self.server.serve_forever,daemon=True).start()
    def close(self):
        with self.lock:
            for ident in list(self.entries):self._remove(ident)
            self.cache.clear();self.cache_bytes=0
        self.server.shutdown();self.server.server_close()
    def cleanup(self):
        with self.lock:
            for ident,e in list(self.entries.items()):
                if time.monotonic()-e['touched']>120:self._remove(ident)
            for ck,(raw,touched) in list(self.cache.items()):
                if time.monotonic()-touched>120:self.cache_bytes-=len(raw);del self.cache[ck]
    def _remove(self,ident):
        self.entries.pop(ident,None)
        for jid,j in list(self.jobs.items()):
            if j['entry']==ident:j['event'].set();self.jobs.pop(jid,None)
    def transfer(self,data,key):
        self.cleanup();owner=str(data['owner']);action=data.get('action')
        with self.lock:
            if action=='release':
                for ident,e in list(self.entries.items()):
                    if e['owner']==owner:self._remove(ident)
                for k,v in list(self.cache.items()):
                    if k[0]==owner:self.cache_bytes-=len(v[0]);del self.cache[k]
                return {'released':True}
            if action=='begin':
                total=data.get('total')
                if isinstance(total,bool) or not isinstance(total,int) or not 12<=total<=MAX_FILE:raise ValueError('录播文件大小无效')
                if len(self.entries)>=8:raise ValueError('分段读取会话过多')
                ident=secrets.token_hex(24)
                self.entries[ident]={'owner':owner,'key':key,'total':total,'touched':time.monotonic()}
                return {'id':ident}
            ident=data.get('id');e=self.entries.get(ident)
            if not e or e['owner']!=owner:raise ValueError('分段读取已取消或过期')
            e['touched']=time.monotonic()
            if action=='abort':self._remove(ident);return {'aborted':True}
            if action=='poll':
                for jid,j in self.jobs.items():
                    if j['entry']==ident and not j['sent']:
                        j['sent']=True;return {'job':{'id':jid,'start':j['start'],'end':j['end']}}
                return {'job':None,'phase':e.get('phase','reading')}
            if action=='result':
                j=self.jobs.get(data.get('jobId'))
                if not j or j['entry']!=ident:raise ValueError('字节范围请求已过期')
                if data.get('error'):j['event'].set();return {'received':True}
                encoded=data.get('data')
                if not isinstance(encoded,str) or len(encoded)>350000:raise ValueError('字节范围响应过大')
                raw=base64.b64decode(encoded,validate=True)
                if len(raw)!=j['end']-j['start']+1:raise ValueError('字节范围响应不完整')
                j['data']=raw;j['event'].set();return {'received':True}
            raise ValueError('未知分段读取操作')
    def phase(self,ident,owner,phase):
        with self.lock:
            e=self.entries.get(ident)
            if e and e['owner']==str(owner):e['phase']=phase

    def url(self,ident,owner,key):
        with self.lock:
            e=self.entries.get(ident)
            if not e or e['owner']!=str(owner) or e['key']!=key:raise ValueError('分段读取会话与课程不匹配')
            e['touched']=time.monotonic()
        return f'http://127.0.0.1:{self.server.server_port}/{ident}'
    def read(self,ident,start,end):
        with self.lock:
            e=self.entries.get(ident)
            if not e:raise RuntimeError('cancelled')
            ck=(e['owner'],e['key'],e['total'],start,end)
            if ck in self.cache:
                raw,_=self.cache[ck];self.cache[ck]=(raw,time.monotonic());self.cache.move_to_end(ck);return raw
            jid=secrets.token_hex(16);j={'entry':ident,'start':start,'end':end,'sent':False,'event':threading.Event(),'data':None}
            self.jobs[jid]=j
        if not j['event'].wait(25):
            with self.lock:self.jobs.pop(jid,None)
            raise RuntimeError('browser range timed out')
        with self.lock:
            self.jobs.pop(jid,None);raw=j['data']
            if raw is None or ident not in self.entries:raise RuntimeError('cancelled')
            if ck not in self.cache:
                self.cache[ck]=(raw,time.monotonic());self.cache_bytes+=len(raw)
                while self.cache_bytes>CACHE_LIMIT:
                    _,old=self.cache.popitem(last=False);self.cache_bytes-=len(old[0])
            return raw
