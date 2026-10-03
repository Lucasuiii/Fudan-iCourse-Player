#!/usr/bin/env python3
"""Compare private reports. Transcript disagreement is NOT ground-truth error rate."""
import argparse
import json
from pathlib import Path
import unicodedata


def normalize(text):
    text = unicodedata.normalize('NFKC', text).casefold()
    out = []
    for i, c in enumerate(text):
        numeric_separator = c in '.:' and 0 < i < len(text)-1 and text[i-1].isdigit() and text[i+1].isdigit()
        if c in '+-−=<>^*/%_' or numeric_separator or (not unicodedata.category(c).startswith(('P', 'Z')) and not c.isspace()):
            out.append(c)
    return ''.join(out)


def distance(a, b):
    if len(a) < len(b): a, b = b, a
    row = list(range(len(b) + 1))
    for i, ac in enumerate(a, 1):
        new = [i]
        for j, bc in enumerate(b, 1):
            new.append(min(new[-1] + 1, row[j] + 1, row[j-1] + (ac != bc)))
        row = new
    return row[-1]


def compare(a, b):
    ar, br = a['results'], b['results']
    if not ar or len(ar) != len(br): raise ValueError('Reports need equal nonempty windows')
    if a['summary'].get('dtype') != b['summary'].get('dtype'):
        raise ValueError('Activation dtypes differ')
    exact = normalized = edits = chars = 0
    changes = []
    for x, y in zip(ar, br):
        bounds = ['start', 'end', 'audio_start', 'audio_end']
        if any(x[k] != y[k] for k in bounds): raise ValueError('Window bounds differ')
        nx, ny = normalize(x['text']), normalize(y['text'])
        exact += x['text'] == y['text']; normalized += nx == ny
        d = distance(nx, ny); edits += d; chars += len(ny)
        if d: changes.append({'start':x['start'], 'edits':d, '8bit':x['text'], 'bf16':y['text']})
    summary = {'windows':len(ar),'exact_equal_windows':exact,'normalized_equal_windows':normalized,
               'normalized_character_edits':edits,'bf16_normalized_characters':chars,
               'disagreement_ratio':edits / chars if chars else None,
               'not_accuracy':'No human reference. This is inter-model disagreement, not CER.'}
    return {'summary':summary, 'metrics':{'8bit':a['summary'],'bf16':b['summary']}, 'differences':changes}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--quantized', type=Path, required=True)
    p.add_argument('--original', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    args = p.parse_args()
    result = compare(json.loads(args.quantized.read_text()), json.loads(args.original.read_text()))
    args.output.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2));args.output.chmod(0o600)
    print(json.dumps(result['summary']))


if __name__ == '__main__': main()
