"""Real ffmpeg demuxing over the same browser-range broker, using synthetic media."""
import base64
from pathlib import Path
import shutil
import subprocess
import tempfile
import threading
import time
import unittest
import wave
from temporary_media import TemporaryMedia,BLOCK

@unittest.skipUnless(shutil.which('ffmpeg'),'ffmpeg is required for decoder integration')
class DecoderTests(unittest.TestCase):
    def test_head_and_tail_mp4_indexes_seek_without_complete_download(self):
        with tempfile.TemporaryDirectory() as tmp:
            for faststart in (False,True):
                with self.subTest(faststart=faststart):
                    video=Path(tmp)/'input.mp4';wav=Path(tmp)/'window.wav'
                    subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-f','lavfi','-i','testsrc2=size=640x360:rate=25','-f','lavfi','-i','sine=frequency=440:sample_rate=16000','-t','30','-c:v','mpeg4','-q:v','2','-c:a','aac',*(['-movflags','+faststart'] if faststart else []),str(video)],check=True,timeout=45)
                    m=TemporaryMedia();owner='test';ident=m.transfer({'owner':owner,'action':'begin','total':video.stat().st_size},'video')['id'];stop=threading.Event();ranges=[]
                    def browser():
                        with video.open('rb') as f:
                            while not stop.is_set():
                                job=m.transfer({'owner':owner,'action':'poll','id':ident},None)['job']
                                if not job:time.sleep(.005);continue
                                ranges.append((job['start'],job['end']));f.seek(job['start']);raw=f.read(job['end']-job['start']+1)
                                m.transfer({'owner':owner,'action':'result','id':ident,'jobId':job['id'],'data':base64.b64encode(raw).decode()},None)
                    worker=threading.Thread(target=browser);worker.start()
                    try:
                        subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-protocol_whitelist','http,tcp','-ss','22','-i',m.url(ident,owner,'video'),'-t','3','-vn','-ac','1','-ar','16000',str(wav)],check=True,capture_output=True,timeout=25)
                        with wave.open(str(wav),'rb') as f:self.assertAlmostEqual(f.getnframes()/f.getframerate(),3,places=1)
                        self.assertTrue(all(b-a+1<=BLOCK for a,b in ranges))
                        self.assertLess(sum(b-a+1 for a,b in ranges),video.stat().st_size)
                        print('decoder range bytes',sum(b-a+1 for a,b in ranges),'of',video.stat().st_size,'faststart',faststart)
                    finally:stop.set();worker.join(2);m.close()

if __name__=='__main__':unittest.main()
