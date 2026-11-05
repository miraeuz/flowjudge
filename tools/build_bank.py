#!/usr/bin/env python3
"""Builds the offline problem bank for the Mirae Flow web app from the teacher's book (MIRAE_Flowgorithm_Tolik_Toplam).
   web/src/data/problemCatalog.json  — public catalogue (statements, examples, judge flags)
   web/src/data/problemTests.json    — id -> {mode, tests[]} (lazy-loaded by the in-browser judge)
Checkers come from: earlier reference solutions (matched by statement text or number), content/refs_tolik.py (new), content/oldchat.py (Nested For)."""
import re, json, sys
sys.path.insert(0, 'content')
from book_refs import REFS as OLD; from oldchat import NF, W26; from refs_tolik import NEW
norm = lambda s: re.sub(r'[^a-z0-9]+', '', s.lower().translate(str.maketrans('‘’ʻʼ`´«»', "''''''  ")))
nref = lambda r: (r[0], r[1], (r[2] if len(r) > 2 and r[2] else 'tokens'), (r[3] if len(r) > 3 else None)) if r else None
def sections(path):
    out = []; cur = None; exp = 1
    for l in (x.strip() for x in open(path, encoding='utf8') if x.strip()):
        m = re.match(r'^#+\s*\*\*(.+?)\*\*\s*$', l)
        if m: cur = {'h': m.group(1), 'items': []}; out.append(cur); exp = 1; continue
        if cur is None or l.startswith('*') or l.startswith('Barcha'): continue
        m = re.match(rf'^{exp}\.\s+(.*)$', l)
        if m: cur['items'].append(m.group(1)); exp += 1
        elif cur['items']: cur['items'][-1] += '\n' + l
    return out
KEYS = ['1', '2', '3', '4', '5', '5.1', '5.2', '6', '6.1', '6.2', '6.3', '6.4', '7']
S = dict(zip(KEYS, sections('content/source/tolik.txt')))
TOPNUM = {1: 'output', 2: 'input', 4: 'if', 5: 'nested-if', 6: 'for', 7: 'while'}; oldtext = {}; items = {}; cur = None; exp = 1
for l in (x.strip() for x in open('content/source/book.txt', encoding='utf8') if x.strip()):
    m = re.match(r'^\*\*(\d+)-mavzu\.', l)
    if m: cur = int(m.group(1)); exp = 1; items[cur] = []; continue
    if cur is None or l.startswith('*'): continue
    m = re.match(rf'^{exp}\.\s+(.*)$', l)
    if m: items[cur].append(m.group(1)); exp += 1
    elif items[cur]: items[cur][-1] += '\n' + l
for tn, lst in items.items():
    for i, t in enumerate(lst, 1):
        r = nref(OLD.get(TOPNUM.get(tn), {}).get(i))
        if r: oldtext[norm(t.split('\n')[0])] = r
NFMAP = {i: f'n{i:02d}' for i in range(1, 25)}; NFMAP.update({25: 'n26', 26: 'n27', 27: 'n28', 28: 'n29', 29: 'n30', 30: 'n31', 31: 'n32', 32: 'n33', 33: 'n34', 34: 'n35'})
NFD = {pid: (fn, cases) for pid, t, st, fn, cases in NF}
RESTORE = {1: '\n* * * * *\n* * * * *\n* * * * *', 9: '\n*\n* *\n* * *\n* * * *', 13: '\n* * * *\n* * *\n* *\n*', 26: '\n* * * * *\n* * * *\n* * *\n* *\n*'}   # shapes lost in the DOCX text extraction
def ref_for(sec, n, text):
    if sec in ('1', '2'):
        r = nref(OLD[{'1': 'output', '2': 'input'}[sec]].get(n))
        if r: return r
    if sec == '6.4':
        if n == 35: return NEW[('6.4', 35)]
        fn, cs = NFD[NFMAP[n]]; return (fn, cs, 'lines', None)
    if sec == '7' and n == 26: return (W26[3], W26[4], 'numbers', None)
    return oldtext.get(norm(text.split('\n')[0])) or NEW.get((sec, n))
def fmt(v):
    if isinstance(v, (list, tuple)): return '\n'.join(map(fmt, v))
    if isinstance(v, float): v = round(v, 6); return str(int(v)) if v.is_integer() else str(v)
    return str(v)
cat = json.load(open('web/src/data/problemCatalog.json')); TOP = {'01': ['1'], '02': ['2'], '03': ['3'], '05': ['4'], '06': ['5.1', '5.2'], '07': ['6.1', '6.2', '6.3'], '08': ['7'], '09': ['6.4']}
tests = {}; bad = 0; stat = {}; none = []
for tid, secs in TOP.items():
    flat = [(sec, n, t) for sec in secs for n, t in enumerate(S[sec]['items'], 1)]
    probs = [p for p in cat['problems'] if p['topicId'] == tid]; assert len(probs) == len(flat), (tid, len(probs), len(flat))
    for p, (sec, n, text) in zip(probs, flat):
        if norm(p['statementUz'].split('\n')[0]) != norm(text.split('\n')[0]): bad += 1; print('MISMATCH', p['id'])
        if sec == '6.4' and n in RESTORE and text.rstrip().endswith(':'): p['statementUz'] = p['statementEn'] = text + RESTORE[n]
        r = ref_for(sec, n, text)
        for k in ('checker', 'expectedOutput', 'testSuite', 'checkerNote', 'examples'): p.pop(k, None)
        p['judgeReady'] = bool(r)
        if r:
            fn, cases, mode, alt = r; ts = []
            for i, c in enumerate(cases):
                out = fmt(fn(*c)); out = [out, fmt(alt(*c))] if alt else out
                ts.append({'in': '\n'.join(map(str, c)), 'out': out, **({'hidden': True} if i >= 2 else {})})
            tests[p['id']] = {'mode': mode, 'tests': ts}; p['checker'] = mode
            p['examples'] = [{'input': t['in'], 'output': t['out'][0] if isinstance(t['out'], list) else t['out']} for t in ts if not t.get('hidden')][:2]
        else: none.append(p['id'])
        st = stat.setdefault(tid, [0, 0]); st[0] += 1; st[1] += bool(r)
for t in cat['topics']: t['state'] = 'available' if t['id'] in TOP else 'awaiting-source'
cat['meta'] = {'importedProblemCount': len(cat['problems']), 'sourceFile': 'MIRAE_Flowgorithm_Tolik_Toplam.docx', 'checked': len(tests)}
json.dump(cat, open('web/src/data/problemCatalog.json', 'w'), ensure_ascii=False, separators=(',', ':'))
json.dump(tests, open('web/src/data/problemTests.json', 'w'), ensure_ascii=False, separators=(',', ':'))
for tid, (n, j) in sorted(stat.items()): print(f'topic {tid}: {n:3} problems, {j:3} auto-checked')
print('TOTAL', sum(v[0] for v in stat.values()), 'problems,', len(tests), 'auto-checked; mismatches:', bad, '; practice-only:', ', '.join(none))
