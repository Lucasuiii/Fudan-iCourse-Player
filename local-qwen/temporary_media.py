"""Bounded temporary browser downloads. No signed URL or session cookie is stored."""
import base64
from pathlib import Path
import secrets
import shutil
import tempfile
import threading
import time

LIMIT=8*1024**3
class TemporaryMedia:
    def __init__(self):
        self.directory=tempfile.TemporaryDirectory(prefix='lyue-media-')
        self.entries={};self.lock=threading.Lock()
    def cleanup(self):
        now=time.monotonic()
        with self.lock:
            for ident,e in list(self.entries.items()):
                if now-e['touched']>1800:self._remove(ident)
    def _remove(self,ident):
        e=self.entries.pop(ident,None)
        if e:e['path'].unlink(missing_ok=True)
    def transfer(self,data,key):
        self.cleanup()
        owner=str(data['owner']);action=data.get('action')
        with self.lock:
            if action=='release':
                for ident,e in list(self.entries.items()):
                    if e['owner']==owner:self._remove(ident)
                return {'released':True}
            if action=='begin':
                total=data.get('total') or 0
                if isinstance(total,bool) or not isinstance(total,(int,float)) or not 0<=total<=LIMIT:raise ValueError('视频大小无效或超过 8 GiB')
                if shutil.disk_usage(self.directory.name).free < total+1024**3:raise ValueError('临时下载磁盘空间不足')
                if len(self.entries)>=2:raise ValueError('临时下载已达上限，请关闭其他播放器')
                ident=secrets.token_hex(16);path=Path(self.directory.name)/(ident+'.mp4');path.touch(mode=0o600)
                self.entries[ident]={'owner':owner,'key':key,'path':path,'size':0,'ready':False,'touched':time.monotonic()}
                return {'id':ident}
            ident=data.get('id');e=self.entries.get(ident)
            if not e or e['owner']!=owner:raise ValueError('临时下载已取消或过期')
            if action=='abort':self._remove(ident);return {'aborted':True}
            if e['ready']:raise ValueError('临时下载已经完成')
            if action=='append':
                if data.get('offset')!=e['size']:raise ValueError('临时下载位置不匹配')
                encoded=data.get('data','')
                if not isinstance(encoded,str) or len(encoded)>700000:raise ValueError('下载分块过大')
                raw=base64.b64decode(encoded,validate=True)
                if not raw or e['size']+len(raw)>LIMIT:raise ValueError('临时视频超过 8 GiB 上限')
                if shutil.disk_usage(self.directory.name).free < len(raw)+1024**3:raise ValueError('临时下载磁盘空间不足')
                with e['path'].open('ab') as f:f.write(raw)
                e['size']+=len(raw);e['touched']=time.monotonic();return {'bytes':e['size']}
            if action=='finish':
                if e['size']<12:raise ValueError('下载没有有效视频数据')
                e['ready']=True;e['touched']=time.monotonic();return {'ready':True}
            raise ValueError('未知临时下载操作')
    def get(self,key):
        self.cleanup()
        with self.lock:
            for e in self.entries.values():
                if e['key']==key and e['ready']:e['touched']=time.monotonic();return e['path']
        return None
