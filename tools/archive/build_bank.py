#!/usr/bin/env python3
"""Puts content/bank2.py (For / While / Array) into the topics as classwork / homework / extra, with computed tests."""
import json, sys, glob
sys.path.insert(0, 'content'); from bank2 import BANKS
def fmt(v): return '\n'.join(map(fmt, v)) if isinstance(v, (list, tuple)) else (str(int(v)) if isinstance(v, float) and float(v).is_integer() else str(round(v, 6)) if isinstance(v, float) else str(v))
def mk(tid, row):
    pid, title, st, fn, cases = row; assert len(cases) >= 4, (tid, pid); tests, words = [], False
    for i, c in enumerate(cases):
        out = fmt(fn(*c)); words |= any(not x.lstrip('-').replace('.', '', 1).isdigit() for x in out.split())
        tests.append({'in': '\n'.join(map(str, c)), 'out': out, **({'hidden': True} if i >= 2 else {})})
    return {'id': f'{tid}-{pid}', 'title': {'uz': title}, 'statement': {'uz': st}, 'source': 'bank2', 'judge': {'mode': 'tokens' if words else 'numbers'}, 'tests': tests}
for tid, (L, H, X) in BANKS.items():
    f, t = next((g, json.load(open(g))) for g in sorted(glob.glob('content/topics/*.json')) if json.load(open(g))['id'] == tid)
    old = [p for p in t['classwork'] + t['homework'] + t.get('extra', []) if p.get('source') != 'bank2']
    t['classwork'], t['homework'] = [mk(tid, r) for r in L], [mk(tid, r) for r in H]; t['extra'] = [mk(tid, r) for r in X] + old
    json.dump(t, open(f, 'w'), ensure_ascii=False, indent=1); print(f'{tid}: {len(L)} lesson + {len(H)} homework + {len(X)} extra with checkers ({len(old)} imported kept hidden)')
