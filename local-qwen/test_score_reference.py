import unittest
from score_reference import score

class ScoringTests(unittest.TestCase):
    def test_exact_audio_bounds_include_context_and_midpoint_ownership(self):
        reference={'response':{'result':{'utterances':[{'words':[{'text':'甲','start_time':0,'end_time':1000},{'text':'乙','start_time':19000,'end_time':21000},{'text':'丙','start_time':22000,'end_time':23000}]}]}}}
        report={'summary':{},'results':[{'start':600,'end':620,'audio_start':600,'audio_end':622,'text':'甲乙'}]}
        result=score(reference,{'bf16':report})['models']['bf16']
        self.assertEqual(result['reference_characters'],2);self.assertEqual(result['agreement_score'],100)
        with self.assertRaises(ValueError):score({'response':{'result':{'utterances':[]}}},{'bf16':report})

if __name__=='__main__':unittest.main()
