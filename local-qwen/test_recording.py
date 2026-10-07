import json
from pathlib import Path
import tempfile
import unittest
import recording as s
class RecordingTests(unittest.TestCase):
 def test_source_rejects_untrusted_and_live(self):
  for url in ['http://icourse.fudan.edu.cn/a.mp4','https://127.0.0.1/a.mp4','https://icourse.fudan.edu.cn.evil.com/a.mp4','https://icourse.fudan.edu.cn/a.m3u8','https://user:pass@icourse.fudan.edu.cn/a.mp4','https://icourse.fudan.edu.cn:8888/a.mp4']:
   with self.assertRaises(ValueError):s.validate_source(url)
 def test_signed_url_refresh_reuses_cache_but_model_and_prompt_changes_do_not(self):
  a=s.cache_key('https://icourse.fudan.edu.cn/a.mp4?sign=old','model','prompt',20)
  self.assertEqual(a,s.cache_key('https://icourse.fudan.edu.cn/a.mp4?sign=new','model','prompt',20))
  self.assertNotEqual(a,s.cache_key('https://icourse.fudan.edu.cn/a.mp4','newmodel','prompt',20))
  self.assertNotEqual(a,s.cache_key('https://icourse.fudan.edu.cn/a.mp4','model','newprompt',20))
 def test_registered_clip_offset_and_file_scope(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp); model=root/'m.bin';model.write_bytes(b'model');media=root/'media';media.mkdir();(media/'clip.wav').write_bytes(b'audio')
   source='https://icourse.fudan.edu.cn/a.mp4?sign=private'
   (media/'recordings.json').write_text(json.dumps({s.recording_key(source):{'file':'clip.wav','offset':600}}))
   e=s.RecordingMedia();e.media_dir=media.resolve()
   self.assertEqual(e.local_clip(source),((media/'clip.wav').resolve(),600,None))
   (media/'recordings.json').write_text(json.dumps({s.recording_key(source):{'file':'../m.bin','offset':600}}))
   self.assertIsNone(e.local_clip(source))
 def test_local_media_is_explicitly_scoped_and_rejects_symlink_escape(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp); model=root/'m.bin';model.write_bytes(b'model')
   media=root/'media';media.mkdir();(media/'a.mp4').write_bytes(b'video')
   e=s.RecordingMedia();e.media_dir=media.resolve()
   self.assertEqual(e.local_media('https://icourse.fudan.edu.cn/folder/a.mp4'),(media/'a.mp4').resolve())
   self.assertIsNone(e.local_media('https://icourse.fudan.edu.cn/no.mp4'))
   self.assertIsNone(e.local_media('https://icourse.fudan.edu.cn/%2Foutside.mp4'))
   outside=root/'outside.mp4';outside.write_bytes(b'private')
   (media/'escape.mp4').symlink_to(outside)
   self.assertIsNone(e.local_media('https://icourse.fudan.edu.cn/escape.mp4'))
 def test_auth_requires_token_expected_host_and_extension_origin(self):
  h=s.handler(None,'secret',8768)
  obj=object.__new__(h)
  obj.headers={'Host':'127.0.0.1:8768','Authorization':'Bearer secret','Origin':'https://evil.com'}
  self.assertFalse(obj.authorized())
  obj.headers['Origin']='chrome-extension://test';self.assertTrue(obj.authorized())
  obj.headers['Host']='evil.com:8768';self.assertFalse(obj.authorized())
if __name__=='__main__':unittest.main()
