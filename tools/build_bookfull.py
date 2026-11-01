#!/usr/bin/env python3
"""Imports the teacher's book (content/book_source.txt) into each topic's 'book' section; refs from content/book_refs.py give the checkers."""
import re, json, sys, glob
sys.path.insert(0, 'content'); from book_refs import REFS
txt = open('content/book_source.txt').read().replace('\\"', '"')
def fmt(v): return '\n'.join(map(fmt, v)) if isinstance(v, (list, tuple)) else (str(int(v)) if isinstance(v, float) and float(v).is_integer() else str(round(v, 6)) if isinstance(v, float) else str(v))
def items(mavzu):
    m = re.search(r'\*\*%d-mavzu[^\n]*\n' % mavzu, txt); rest = txt[m.end():]; n = re.search(r'\n\*\*\d-mavzu', rest); rest = rest[:n.start()] if n else rest
    out, nxt = [], 1
    for l in rest.splitlines():
        l = l.strip()
        if not l or l.startswith('*'): continue
        mm = re.match(r'^(\d+)\. (.*)$', l)
        if mm and int(mm.group(1)) == nxt: out.append(mm.group(2)); nxt += 1
        elif out: out[-1] += '\n' + l
    return out
def short(s): s = s.split('\n')[0]; return s if len(s) <= 62 else s[:62].rsplit(' ', 1)[0] + '…'
for tid, (mav, refs) in REFS.items():
    f, t = next((g, json.load(open(g))) for g in sorted(glob.glob('content/topics/*.json')) if json.load(open(g))['id'] == tid)
    t['book'], done = [], 0
    for k, st in enumerate(items(mav), 1):
        p = {'id': f'{tid}-k{k:02d}', 'title': {'uz': short(st)}, 'statement': {'uz': st}, 'source': 'book', 'judge': None, 'tests': []}
        if k in refs:
            fn, cases, *mode = refs[k]; assert len(cases) >= 4 or cases == [()], (tid, k)
            p['judge'] = {'mode': mode[0] if mode else 'tokens'}; done += 1
            p['tests'] = [{'in': '\n'.join(map(str, c)), 'out': fmt(fn(*c)), **({'hidden': True} if i >= 2 else {})} for i, c in enumerate(cases)]
        t['book'].append(p)
    json.dump(t, open(f, 'w'), ensure_ascii=False, indent=1); print(f"{tid:10} book topic {mav}: {len(t['book'])} problems, {done} with checkers")
