import tempfile
import threading
import unittest
import wave
from pathlib import Path
from unittest.mock import patch
from service import Engine,usable_clip

class ClipFallbackTests(unittest.TestCase):
    def test_excerpt_bounds_do_not_override_whole_recording(self):
        clip=(Path('excerpt.mp4'),600,1800)
        self.assertEqual(usable_clip(clip,600,620),clip)
        self.assertEqual(usable_clip(clip,2380,2400),clip)
        self.assertIsNone(usable_clip(clip,580,600))
        self.assertIsNone(usable_clip(clip,2400,2420))
        self.assertIsNone(usable_clip(clip,2390,2410))

    def test_wav_actual_length_and_remote_seek_fallback(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);audio=root/'excerpt.wav'
            def write_wav(path,seconds):
                with wave.open(str(path),'wb') as f:
                    f.setnchannels(1);f.setsampwidth(2);f.setframerate(16000);f.writeframes(b'\x01\x00'*16000*seconds)
            write_wav(audio,20)
            clip=(audio,600,1800) # Registry incorrectly claims a longer excerpt.
            self.assertIsNotNone(usable_clip(clip,600,620))
            self.assertIsNone(usable_clip(clip,620,640))
            engine=Engine.__new__(Engine);engine.lock=threading.Lock();engine.cache=root;engine.model_id='test';engine.ffmpeg='ffmpeg'
            engine.local_clip=lambda source:clip;engine.local_media=lambda source:None
            engine.infer=lambda pcm,prompt:{'text':'测试','segments':[{'text':'测试','start':2,'end':3}],'truncated':False}
            commands=[]
            def extract(cmd,**kwargs):commands.append(cmd);write_wav(Path(cmd[-1]),24)
            with patch('service.subprocess.run',side_effect=extract):
                result=engine.chunk('https://icourse.fudan.edu.cn/test.mp4',620,1000)
            self.assertEqual(result['start'],620)
            cmd=commands[0];self.assertEqual(cmd[cmd.index('-ss')+1],'618')
            self.assertEqual(cmd[cmd.index('-i')+1],'https://icourse.fudan.edu.cn/test.mp4')
            self.assertEqual(result['cues'][0]['start'],620)

if __name__=='__main__':unittest.main()
