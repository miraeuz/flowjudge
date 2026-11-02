#!/usr/bin/env python3
"""Builds content/topics/*.json ONLY from the teacher's sources: the book (content/source/book.txt) and the old-chat Nested For list (content/oldchat.py)."""
import re, json, sys, os
sys.path.insert(0, 'content'); from book_refs import REFS; from oldchat import NF, W26
T = [  # id, order, book topic number, title uz, title en, lesson uz, lesson en
 ('output', 1, 1, "Assign va Output", "Assign and Output", "Faqat Assign + Output. Butun sonlar. Hayotiy oddiy vaziyatlar.", "Assign + Output only. Whole numbers. Simple everyday situations."),
 ('input', 2, 2, "Input va hisoblash", "Input and calculations", "Input, Assign va Output. Asosan butun sonlar va hayotiy vaziyatlar.", "Input, Assign and Output. Mostly whole numbers and everyday situations."),
 ('if', 3, 4, "If — shart operatori", "If — conditions", "Oddiy if, if-else va bir nechta shartli hayotiy masalalar.", "Simple if, if-else and multi-condition everyday problems."),
 ('nested-if', 4, 5, "Nested If — ichma-ich shart", "Nested If", "Asosan 2 darajali nested If. Hayotiy vaziyatlar bilan.", "Mostly two-level nested If with everyday situations."),
 ('for', 5, 6, "For tsikli", "For loop", "Oddiy For → Input + If ichida For → Nested For.", "Simple For → For with Input and If → Nested For."),
 ('nested-for', 6, None, "Nested For — ichma-ich For", "Nested For", "Ichma-ich For (bir For ichida yana For): chiziqli shakllar, uchburchaklar, karra jadvali.", "Nested For (a For inside a For): lines, triangles and multiplication tables."),
 ('while', 7, 7, "While tsikli", "While loop", "Oddiy While. For ga o'xshash mashqlar While bilan yechiladi.", "Plain While. For-like exercises solved with While."),
]
def parse_book(path):
    items, cur, exp = {}, None, 1
    for raw in open(path, encoding='utf8'):
        l = raw.strip()
        if not l: continue
        m = re.match(r'^\*\*(\d+)-mavzu\.', l)
        if m: cur, exp = int(m.group(1)), 1; items[cur] = []; continue
        if cur is None or l.startswith('*'): continue
        m = re.match(rf'^{exp}\.\s+(.*)$', l)
        if m: items[cur].append(m.group(1)); exp += 1
        elif items[cur]: items[cur][-1] += '\n' + l
    return items
def fmt(v):
    if isinstance(v, (list, tuple)): return '\n'.join(map(fmt, v))
    if isinstance(v, float): v = round(v, 6); return str(int(v)) if v.is_integer() else str(v)
    return str(v)
def short(s):
    s = re.sub(r'\s+', ' ', s.replace('\\', ''))
    return s if len(s) <= 62 else s[:62].rsplit(' ', 1)[0] + '…'
def mk(pid, text, ref, title=None):
    p = {'id': pid, 'title': {'uz': title or short(text)}, 'statement': {'uz': text.replace('\\', '')}, 'judge': None, 'tests': []}
    if ref:
        fn, cases = ref[0], ref[1]; mode = ref[2] if len(ref) > 2 else 'tokens'
        p['judge'] = {'mode': mode}
        p['tests'] = [{'in': '\n'.join(map(str, c)), 'out': fmt(fn(*c)), **({'hidden': True} if i >= 2 else {})} for i, c in enumerate(cases)]
    return p
book = parse_book('content/source/book.txt'); os.makedirs('content/topics', exist_ok=True)
for f in os.listdir('content/topics'): os.remove('content/topics/' + f)
tot = judged = 0
for tid, order, bt, tu, te, lu, le in T:
    if tid == 'nested-for':
        probs = [mk(f'nested-for-{pid}', st, (fn, cases, 'lines'), title) for pid, title, st, fn, cases in NF]
    else:
        refs = REFS.get(tid, {}); probs = [mk(f'{tid}-{i}', txt, refs.get(i)) for i, txt in enumerate(book[bt], 1)]
        if tid == 'while': pid, title, st, fn, cases = W26; probs.append(mk('while-c26', st, (fn, cases, 'tokens'), title))
    t = {'id': tid, 'order': order, 'title': {'uz': tu, 'en': te}, 'lesson': {'uz': lu, 'en': le}, 'classwork': probs[:20], 'homework': probs[20:50], 'extra': probs[50:]}
    json.dump(t, open(f'content/topics/{order:02d}-{tid}.json', 'w'), ensure_ascii=False, indent=1)
    j = sum(1 for p in probs if p['tests']); tot += len(probs); judged += j
    print(f"{tid:11} {len(probs):3} problems   auto-checked {j:3}   practice-only {len(probs) - j}")
print(f'TOTAL {tot} problems, {judged} auto-checked, {tot - judged} practice-only')
