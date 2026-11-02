#!/usr/bin/env python3
"""Adds content/practice.py problems (with computed tests) into topic JSON as the 'practice' section."""
import json, glob, sys, os
sys.path.insert(0, 'content'); from practice import P, NEWTOPICS
def fmt(v):
    if isinstance(v, (list, tuple)): return '\n'.join(fmt(x) for x in v)
    if isinstance(v, float):
        v = round(v, 6); return str(int(v)) if v.is_integer() else str(v)
    return str(v)
files = {}
for f in glob.glob('content/topics/*.json'): t = json.load(open(f)); files[t['id']] = (f, t)
for tid, (order, uz, en, lu, le) in NEWTOPICS.items():
    if tid not in files:
        t = {'id': tid, 'order': order, 'title': {'uz': uz, 'en': en}, 'lesson': {'uz': lu, 'en': le}, 'classwork': [], 'homework': [], 'extra': []}
        files[tid] = (f'content/topics/06b-{tid}.json', t)
for tid, (f, t) in files.items(): t['practice'] = []
errs = []
for tid, pid, tu, te, su, se, fn, cases in P:
    if tid not in files: errs.append(f'{pid}: unknown topic {tid}'); continue
    if len(cases) < 4: errs.append(f'{pid}: need >= 4 cases')
    tests, words = [], False
    for i, c in enumerate(cases):
        try: out = fmt(fn(*c))
        except Exception as e: errs.append(f'{pid} {c}: {e}'); continue
        words |= any(not tok.lstrip('-').replace('.', '', 1).isdigit() for tok in out.split())
        tests.append({'in': '\n'.join(fmt(x) for x in c), 'out': out, **({'hidden': True} if i >= 2 else {})})
    files[tid][1]['practice'].append({'id': pid, 'title': {'uz': tu, 'en': te}, 'statement': {'uz': su, 'en': se}, 'source': 'practice', 'judge': {'mode': 'tokens' if words else 'numbers'}, 'tests': tests})
for tid, (f, t) in files.items(): json.dump(t, open(f, 'w'), ensure_ascii=False, indent=1)
print(f'{len(P)} practice problems:', ', '.join(f"{tid} {len(t['practice'])}" for tid, (f, t) in files.items() if t['practice']))
print('ERRORS:\n' + '\n'.join(errs) if errs else 'all practice solutions ran OK'); sys.exit(1 if errs else 0)
