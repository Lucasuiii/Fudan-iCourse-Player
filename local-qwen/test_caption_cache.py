import json
import tempfile
import unittest
from pathlib import Path
from service import Engine,legacy,group_words

class CaptionCacheTests(unittest.TestCase):
    def test_restart_signature_change_and_busy_model_reuse_timestamps(self):
        with tempfile.TemporaryDirectory() as d:
            source='https://icourse.fudan.edu.cn/lesson.mp4?token=expired'
            result={'start':20,'end':40,'audio_start':18,'words':[{'start':2,'end':3,'text':'已识别字幕'}]}
            path=Path(d)/(legacy.cache_key(source,'model','QR',20)+'.json')
            path.write_text(json.dumps(result))
            restarted=Engine.__new__(Engine);restarted.cache=Path(d);restarted.model_id='model'
            restarted.local_clip=lambda *_:self.fail('Cache hit must not read media')
            # No model, lock or FFmpeg is installed on this simulated restarted engine.
            reused=restarted.chunk('https://icourse.fudan.edu.cn/lesson.mp4?token=new',20,100,'QR')
            self.assertTrue(reused['cached']);self.assertEqual(reused['alignedWords'][0]['start'],20)
            self.assertEqual(reused['cues'][0]['text'],'已识别字幕')
            self.assertIsNone(restarted.cached_chunk(source,20,100,'different terms'))
            self.assertIsNone(restarted.cached_chunk(source,20,30,'QR'))
            restarted.model_id='new model';self.assertIsNone(restarted.cached_chunk(source,20,100,'QR'))

    def test_corrupt_cache_is_a_miss_and_sentence_layout_preserves_text(self):
        with tempfile.TemporaryDirectory() as d:
            source='https://icourse.fudan.edu.cn/lesson.mp4'
            e=Engine.__new__(Engine);e.cache=Path(d);e.model_id='model'
            (e.cache/(legacy.cache_key(source,'model','',0)+'.json')).write_text('{')
            self.assertIsNone(e.cached_chunk(source,0,100))
        words=[{'start':i*0.1,'end':(i+1)*0.1,'text':c} for i,c in enumerate('这是一个超过二十二个字但是仍然应该完整显示的句子。下一句。')]
        cues=group_words(words,0,0,20)
        self.assertEqual(len(cues),2)
        self.assertEqual(''.join(c['text'] for c in cues),''.join(w['text'] for w in words))
        self.assertTrue(cues[0]['text'].endswith('。'))

if __name__=='__main__':unittest.main()
