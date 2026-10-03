import unittest
from service import group_words

class AlignmentTests(unittest.TestCase):
    def test_overlap_owns_each_word_once(self):
        words=[{'text':'前','start':1,'end':2},{'text':'正','start':2,'end':3},{'text':'后','start':21,'end':23}]
        cues=group_words(words,598,600,620)
        self.assertEqual(''.join(c['text'] for c in cues),'正')
        self.assertTrue(all(600<=c['start']<c['end']<=620 for c in cues))
    def test_short_cues_and_nonfinite_words(self):
        words=[{'text':'a','start':0,'end':1},{'text':'b','start':2,'end':3},{'text':'bad','start':float('nan'),'end':4}]
        self.assertEqual(len(group_words(words,0,0,20)),2)

if __name__=='__main__':unittest.main()
