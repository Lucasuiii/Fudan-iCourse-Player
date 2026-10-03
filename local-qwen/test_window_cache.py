import tempfile
import unittest
import wave
from pathlib import Path
from window_cache import WindowCache
from pilot import simulate


class CacheTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.audio = self.root / 'audio.wav'
        with wave.open(str(self.audio), 'wb') as f:
            f.setparams((1, 2, 16000, 0, 'NONE', 'not compressed'))
            f.writeframes(b'\xe8\x03' * 16000 * 125)
        self.calls = []

    def tearDown(self):
        self.tmp.cleanup()

    def infer(self, pcm, context):
        self.calls.append((len(pcm) / 32000, context))
        return {'text': '课堂文本', 'truncated': False}

    def cache(self, **kwargs):
        return WindowCache(self.audio, self.root / 'cache', self.infer, kwargs.pop('model_id', 'model-a'), offset=kwargs.pop('offset', 600), **kwargs)

    def test_clip_context_bounds_and_cache_hit(self):
        c = self.cache()
        first = c.get(600)
        self.assertEqual((first['audio_start'], first['audio_end']), (600, 622))
        self.assertFalse(first['cached'])
        self.assertTrue(c.get(600.0)['cached'])
        self.assertEqual(len(self.calls), 1)
        last = c.get(720)
        self.assertEqual((last['end'], last['audio_end']), (725, 725))
        self.assertEqual(self.calls[-1][0], 7)

    def test_seek_priority_and_horizon(self):
        c = self.cache()
        self.assertEqual(c.plan(650, 40), [640, 660, 680])
        self.assertEqual(c.plan(650, 0), [640])
        self.assertEqual(c.plan(710), [700, 720])
        with self.assertRaises(ValueError): c.plan(650, 101)
        for position in (599, 725, float('nan')):
            with self.assertRaises(ValueError): c.plan(position)

    def test_non_aligned_import_uses_consistent_windows(self):
        c = self.cache(offset=601)
        self.assertEqual(c.plan(650, 40), [641, 661, 681])
        self.assertEqual(c.plan(601, 0), [601])

    def test_model_terms_and_audio_invalidate(self):
        self.cache().get(600)
        self.cache(context='QR').get(600)
        self.cache(model_id='model-b').get(600)
        with self.audio.open('r+b') as f:
            f.seek(44); f.write(b'\x01\x00')
        self.cache().get(600)
        self.assertEqual(len(self.calls), 4)

    def test_digital_silence_bypasses_model(self):
        with wave.open(str(self.audio), 'wb') as f:
            f.setparams((1, 2, 16000, 0, 'NONE', 'not compressed'))
            f.writeframes(b'\x00\x00' * 16000 * 24)
        c = self.cache()
        self.assertEqual(c.get(600)['text'], '')
        self.assertEqual(self.calls, [])
        self.assertTrue(c.get(600)['cached'])

    def test_truncation_not_cached(self):
        c = self.cache()
        c.infer = lambda pcm, context: {'text': 'incomplete', 'truncated': True}
        with self.assertRaises(RuntimeError): c.get(600)
        self.assertEqual(list(c.cache.glob('*.json')), [])

    def test_limit_and_input_validation(self):
        c = self.cache(limit=2)
        for start in (600, 620, 640): c.get(start)
        self.assertEqual(len(list(c.cache.glob('*.json'))), 2)
        self.assertFalse(c.get(600)['cached'])
        with self.assertRaises(ValueError): self.cache(context='x' * 801)
        with self.assertRaises(ValueError): c.get(725)

    def test_prefetch_simulation_obeys_horizon(self):
        self.assertEqual(simulate([2] * 10, 20, 2)['late_windows_after_start'], 0)
        self.assertGreater(simulate([12] * 10, 20, 2)['late_windows_after_start'], 0)
        self.assertGreater(simulate([2] * 10, 20, 2, horizon=0)['late_windows_after_start'], 0)


if __name__ == '__main__': unittest.main()
