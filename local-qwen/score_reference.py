#!/usr/bin/env python3
"""Window-matched machine-reference CER, not human recognition accuracy."""
import argparse
import json
from pathlib import Path
from compare import normalize, distance

def score(reference, reports, offset=600):
    words=[w for u in reference['response']['result'].get('utterances',[]) for w in u.get('words',[])]
    if not words:raise ValueError('Reference has no word timestamps; cannot score matching input windows')
    baseline=next(iter(reports.values()))['results']
    output={}
    for name,report in reports.items():
        if len(report['results'])!=len(baseline):raise ValueError('Window counts differ')
        edits=characters=0;windows=[]
        for a,b in zip(report['results'],baseline):
            if any(a[k]!=b[k] for k in ('start','end','audio_start','audio_end')):raise ValueError('Window bounds differ')
            text=''.join(str(w['text']) for w in words if a['audio_start']-offset <= (w['start_time']+w['end_time'])/2000 < a['audio_end']-offset)
            r,h=normalize(text),normalize(a['text'])
            d=distance(r,h);edits+=d;characters+=len(r)
            windows.append({'start':a['start'],'reference_characters':len(r),'edits':d})
        if not characters:raise ValueError('Empty reference')
        output[name]={'windows':len(windows),'reference_characters':characters,'edits':edits,'machine_reference_cer':edits/characters,'agreement_score':max(0,100*(1-edits/characters)),'window_metrics':windows,'runtime':report['summary']}
    return {'method':'NFKC/casefold, punctuation/spacing removed, math operators preserved. Reference words selected by midpoint within each exact input window. Overlapping context is included in both outputs; denominator repeats overlap. This is machine-reference agreement, NOT human accuracy. ITN and word-boundary differences can affect CER.','models':output}

def main():
    p=argparse.ArgumentParser(description=__doc__)
    for k in ('reference','quantized','original','output'):p.add_argument('--'+k,type=Path,required=True)
    a=p.parse_args();result=score(json.loads(a.reference.read_text()),{'8bit':json.loads(a.quantized.read_text()),'bf16':json.loads(a.original.read_text())})
    a.output.write_text(json.dumps(result,ensure_ascii=False,indent=2));a.output.chmod(0o600)
    print(json.dumps({k:{f:v[f] for f in ('windows','reference_characters','edits','machine_reference_cer','agreement_score')} for k,v in result['models'].items()}))

if __name__=='__main__':main()
