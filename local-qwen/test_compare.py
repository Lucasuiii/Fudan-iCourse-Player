import unittest
from compare import compare, distance, normalize


def report(text, dtype='bfloat16', start=600):
    return {'summary':{'dtype':dtype},'results':[{'start':start,'end':start+20,'audio_start':start,'audio_end':start+22,'text':text}]}


class ComparisonTests(unittest.TestCase):
    def test_normalization_keeps_mathematical_content(self):
        self.assertEqual(normalize('ＱＲ 分解，A=1。'), 'qr分解a=1')
        self.assertNotEqual(normalize('A=1'), normalize('A=2'))
        self.assertNotEqual(normalize('A=-1'), normalize('A=1'))
        self.assertNotEqual(normalize('1.2'), normalize('12'))

    def test_distance_is_symmetric(self):
        self.assertEqual(distance('abc', 'adc'), 1)
        self.assertEqual(distance('', 'ab'), distance('ab', ''))

    def test_disagreement_does_not_become_accuracy(self):
        r = compare(report('矩阵。'), report('矩阵'))
        self.assertEqual(r['summary']['normalized_equal_windows'], 1)
        self.assertEqual(r['summary']['exact_equal_windows'], 0)
        self.assertIn('not_accuracy',r['summary'])
        self.assertNotIn('accuracy',r['summary'])

    def test_rejects_mismatched_inputs(self):
        with self.assertRaises(ValueError): compare(report('a'), report('a',dtype='float16'))
        with self.assertRaises(ValueError): compare(report('a'), report('a',start=620))


if __name__ == '__main__': unittest.main()
