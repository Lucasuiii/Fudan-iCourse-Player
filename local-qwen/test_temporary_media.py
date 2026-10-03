import base64
import threading
import time
import unittest
from urllib.request import Request,urlopen
from temporary_media import TemporaryMedia,BLOCK
from service import audio_read_error

class TemporaryMediaTests(unittest.TestCase):
    def test_scoped_range_transport_cache_and_release(self):
        m=TemporaryMedia()
        try:
            ident=m.transfer({'owner':'1','action':'begin','total':5*1024**3},'video')['id']
            with self.assertRaises(ValueError):m.url(ident,'2','video')
            url=m.url(ident,'1','video');output=[]
            t=threading.Thread(target=lambda:output.append(urlopen(Request(url,headers={'Range':'bytes=1048576-1048591'})).read()));t.start()
            job=None
            for _ in range(100):
                job=m.transfer({'owner':'1','action':'poll','id':ident},None)['job']
                if job:break
                time.sleep(.01)
            self.assertEqual(job['start'],1048576);self.assertEqual(job['end'],1048591)
            with self.assertRaises(ValueError):m.transfer({'owner':'2','action':'result','id':ident,'jobId':job['id'],'data':base64.b64encode(b'a'*16).decode()},None)
            m.transfer({'owner':'1','action':'result','id':ident,'jobId':job['id'],'data':base64.b64encode(b'a'*16).decode()},None)
            t.join(3);self.assertEqual(output,[b'a'*16]);self.assertEqual(m.cache_bytes,16)
            self.assertEqual(urlopen(Request(url,headers={'Range':'bytes=1048576-1048591'})).read(),b'a'*16)
            self.assertFalse(m.jobs)
            m.transfer({'owner':'1','action':'release'},None);self.assertEqual(m.cache_bytes,0);self.assertFalse(m.entries)
        finally:m.close()
    def test_cancel_wakes_waiting_decoder_without_fetching_file(self):
        m=TemporaryMedia()
        try:
            ident=m.transfer({'owner':'1','action':'begin','total':1000000},'video')['id'];errors=[]
            def read():
                try:m.read(ident,0,BLOCK-1)
                except RuntimeError:errors.append(True)
            t=threading.Thread(target=read);t.start()
            for _ in range(100):
                if m.jobs:break
                time.sleep(.01)
            m.transfer({'owner':'1','action':'abort','id':ident},None);t.join(1)
            self.assertEqual(errors,[True]);self.assertFalse(m.jobs)
            self.assertNotIn('SECRET',audio_read_error(b'https://a/?token=SECRET 403 Forbidden'))
        finally:m.close()

if __name__=='__main__':unittest.main()
