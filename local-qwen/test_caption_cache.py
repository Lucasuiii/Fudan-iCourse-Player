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

class CaptionExportTests(unittest.TestCase):
    def test_export_reads_all_saved_windows_beyond_page_memory_and_excludes_other_terms(self):
        with tempfile.TemporaryDirectory() as d:
            e=Engine.__new__(Engine);e.cache=Path(d);e.model_id='model'
            source='https://icourse.fudan.edu.cn/lesson.mp4'
            for start in [0,40]:
                p=e.cache/(legacy.cache_key(source,'model','QR',start)+'.json')
                p.write_text(json.dumps({'start':start,'end':start+20,'audio_start':start,'words':[{'start':0,'end':1,'text':'本课'}]}))
            result=e.export_captions(source+'?signature=renewed',60,'QR')
            self.assertEqual((result['completed'],result['total']),(2,3))
            self.assertEqual([w['start'] for w in result['windows']],[0,40])
            self.assertNotIn('source',json.dumps(result))
            self.assertEqual(e.export_captions(source,60,'other')['completed'],0)
