#!/usr/bin/env python3
"""Puts content/nested.py (30 lesson + 40 homework + 30 extra) into the nested-if topic, with computed tests."""
import json, sys, glob
sys.path.insert(0, 'content'); from nested import LESSON, HOMEWORK, EXTRA
f = glob.glob('content/topics/*-nested-if.json')[0]; t = json.load(open(f))
def fmt(v): return '\n'.join(map(fmt, v)) if isinstance(v, (list, tuple)) else str(v)
def mk(row):
    pid, title, st, fn, cases = row; assert len(cases) >= 4, pid; tests, words = [], False
    for i, c in enumerate(cases):
        out = fmt(fn(*c)); words |= any(not x.lstrip('-').isdigit() for x in out.split())
        tests.append({'in': '\n'.join(map(str, c)), 'out': out, **({'hidden': True} if i >= 2 else {})})
    return {'id': f'nested-if-{pid}', 'title': {'uz': title}, 'statement': {'uz': st}, 'source': 'nested', 'judge': {'mode': 'tokens' if words else 'numbers'}, 'tests': tests}
old = [p for p in t['classwork'] + t['homework'] + t.get('extra', []) if p.get('source') != 'nested']
t['classwork'], t['homework'] = [mk(r) for r in LESSON], [mk(r) for r in HOMEWORK]
t['extra'] = [mk(r) for r in EXTRA] + old          # imported worksheet items (no checker yet) stay behind the new ones
json.dump(t, open(f, 'w'), ensure_ascii=False, indent=1)
print(f"nested-if: {len(LESSON)} lesson + {len(HOMEWORK)} homework + {len(EXTRA)} extra, all with checkers; {len(old)} imported kept hidden")
