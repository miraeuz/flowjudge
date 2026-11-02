#!/usr/bin/env python3
"""Adds the teacher's book problems (content/book.py) as the 'book' section of nested-for and while, with computed tests."""
import json, sys, glob
sys.path.insert(0, 'content'); from book import BOOK
def fmt(v): return '\n'.join(map(fmt, v)) if isinstance(v, (list, tuple)) else str(v)
for tid, (rows, mode) in BOOK.items():
    f, t = next((g, json.load(open(g))) for g in sorted(glob.glob('content/topics/*.json')) if json.load(open(g))['id'] == tid)
    t['book'] = []
    for pid, title, st, fn, cases in rows:
        assert len(cases) >= 4 or cases == [()], pid
        t['book'].append({'id': f'{tid}-{pid}', 'title': {'uz': title}, 'statement': {'uz': st}, 'source': 'book', 'judge': {'mode': mode},
                          'tests': [{'in': '\n'.join(map(str, c)), 'out': fmt(fn(*c)), **({'hidden': True} if i >= 2 else {})} for i, c in enumerate(cases)]})
    json.dump(t, open(f, 'w'), ensure_ascii=False, indent=1); print(f'{tid}: {len(rows)} book problems with checkers')
