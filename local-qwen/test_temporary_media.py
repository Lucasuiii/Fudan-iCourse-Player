import base64
import unittest
from unittest.mock import patch
from temporary_media import TemporaryMedia
from service import audio_read_error

class TemporaryMediaTests(unittest.TestCase):
    def test_transfer_is_scoped_bounded_and_deleted(self):
        m=TemporaryMedia()
        try:
            ident=m.transfer({'owner':'1','action':'begin'},'video')['id']
            with self.assertRaises(ValueError):m.transfer({'owner':'2','action':'finish','id':ident},None)
            with self.assertRaises(ValueError):m.transfer({'owner':'1','action':'append','id':ident,'offset':3,'data':'AAAA'},None)
            data=base64.b64encode(b'fake MP4 bytes for transport').decode()
            m.transfer({'owner':'1','action':'append','id':ident,'offset':0,'data':data},None)
            self.assertIsNone(m.get('video'))
            m.transfer({'owner':'1','action':'finish','id':ident},None)
            path=m.get('video');self.assertTrue(path.exists())
            m.transfer({'owner':'2','action':'release'},None);self.assertTrue(path.exists())
            m.transfer({'owner':'1','action':'release'},None);self.assertFalse(path.exists())
        finally:m.directory.cleanup()
    def test_expiration_and_safe_error_category(self):
        m=TemporaryMedia()
        try:
            ident=m.transfer({'owner':'1','action':'begin'},'video')['id'];path=m.entries[ident]['path']
            with patch('temporary_media.time.monotonic',return_value=m.entries[ident]['touched']+1801):m.cleanup()
            self.assertFalse(path.exists())
            msg=audio_read_error(b'https://server/private.mp4?token=SECRET Server returned 403 Forbidden')
            self.assertIn('403',msg);self.assertNotIn('SECRET',msg)
        finally:m.directory.cleanup()

if __name__=='__main__':unittest.main()
