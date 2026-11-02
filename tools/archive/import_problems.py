#!/usr/bin/env python3
"""Import teacher .docx worksheets into content/topics/*.json  (usage: python3 tools/import_problems.py DOCS_DIR)
Removes copies and near-duplicates ("a>2", "a>3", "a>4"... keep one), splits 20 classwork / 30 homework / rest extra,
and auto-creates tests for no-input expression problems ("a = 4, b = 7. a + b ni toping")."""
import re, sys, json, subprocess, os, glob
DOCS = sys.argv[1] if len(sys.argv) > 1 else 'tools/_docs_tmp'
OUT = 'content/topics'
TOPICS = {  # id: (order, uz, en, lesson uz, lesson en, files in teaching order easy->hard)
 'basics': (1, "Boshlash: Output va amallar", "Getting started: Output", "Flowgorithm oynasi, Start/End va Output bloklari. Berilgan qiymatlar bilan oddiy hisoblashlar.", "The Flowgorithm window, Start/End and Output blocks. Simple calculations with given values.",
   ['Algoritm_oddiy_misollar', 'Bloksxema_vazifalar_80ta', 'Bloksxema_vazifalar_100ta']),
 'input': (2, "Input — ma'lumot kiritish", "Input — reading data", "Input bloki foydalanuvchidan qiymat oladi va o'zgaruvchiga saqlaydi. Tartib: Declare → Input → Assign → Output.", "The Input block reads a value from the user into a variable. Order: Declare → Input → Assign → Output.",
   ['Algoritm_input_oddiy_misollar', 'Bir_input_50', 'INPUT_masalalari_50', 'Algoritm_hayotiy_aniq_masalalar', 'Algoritm_hayotiy_kiritishli_30', 'Algoritm_hayotiy_kiritishli_50', 'Uyga_vazifa_INPUT_30', 'Yangi_hayotiy_INPUT_50']),
 'types': (3, "Integer, Real va div/mod", "Integer, Real and div/mod", "Butun sonlar uchun Integer, kasrlar uchun Real. div — butun bo'lish, mod — qoldiq.", "Integer for whole numbers, Real for fractions. div is integer division, mod is the remainder.",
   ['Flowgorithm_50_masala', 'Algoritm_int_double_80', 'kiritishli_int_double_40', 'kiritishli_int_double_50_2', 'Flowgorithm_30_qiyin']),
 'if': (4, "If — shart", "If — conditions", "If bloki shartni tekshiradi: True bo'lsa bir yo'l, False bo'lsa boshqa yo'l. Taqqoslash: > < >= <= = <>.", "The If block checks a condition: one path for True, another for False. Compare with > < >= <= = <>.",
   ['Flowgorithm_if_dars30_vazifa50', 'If_hayotiy_50']),
 'nested-if': (5, "Ichma-ich If va mantiq", "Nested If and logic", "If ichida yana If. and / or / not bilan murakkab shartlar tuzing.", "An If inside an If. Build richer conditions with and / or / not.",
   ['Flowgorithm_Ichma_ich_if_yaxshilangan', 'Flowgorithm_ichma_ich_if']),
 'for': (6, "For — sanoqli tsikl", "For — counted loops", "For boshlang'ich, oxirgi qiymat va qadam bilan amalni takrorlaydi.", "For repeats an action using a start, an end and a step.",
   ['Flowgorithm_For_Boshlovchilar_20_masala', 'For_masalalar_toplami']),
 'nested-for': (7, "Ichma-ich For", "Nested For", "For ichida For: tashqi tsikl — guruhlar, ichki tsikl — a'zolar.", "A For inside a For: the outer loop walks groups, the inner loop walks members.",
   ['Flowgorithm_For_Yengil_Ichma_ich_20_masala', 'Flowgorithm_For_Ortacha_25_masala', 'Flowgorithm_Ichma_ich_For_30_masala']),
 'array': (8, "Array — massivlar", "Arrays", "Massiv bir nechta qiymatni bitta nom ostida saqlaydi. Elementlarga indeks bilan murojaat qilinadi (0 dan).", "An array stores several values under one name. Elements are accessed by index (from 0).",
   ['Array_kirishsiz_30', 'Array_hayotiy_30']),
 'mixed': (9, "Aralash mashqlar", "Mixed practice", "Barcha o'tilgan mavzular: input, if, for, hisoblash.", "All topics so far: input, if, for and calculations.",
   ['Flowgorithm_sinf_20', 'Flowgorithm_50_masala_Barcha_mavzular']),
 'exam': (10, "Imtihon", "Exam", "Murakkabroq, bir necha mavzuni birlashtiruvchi masalalar.", "Harder problems that combine several topics.",
   ['Flowgorithm_Imtihon_20_orta', 'Flowgorithm_Imtihon_20_qiyin']),
}
def clean(s):
    s = re.sub(r'\*+', '', s).replace('\\', '')
    s = re.sub(r'[‘’ʻʼ`]', "'", s); s = re.sub(r'→\s*Declare:.*$', '', s)
    return re.sub(r'\s+', ' ', s).strip(' -–:')
def extract(path):
    return subprocess.run(['extract-text', path], capture_output=True, text=True).stdout.splitlines()
P1 = re.compile(r'^\*\*\s*(\d+)(?:-masala)?\.?\s*\*\*\s*(.+)$'); P2 = re.compile(r'^(\d+)\.\s+(.+)$')
P3 = re.compile(r'^#+\s*(\d+)\.\s*(.+)$'); P4 = re.compile(r'^-\s+\*\*(.+?)\*\*\s*(.+)$')
def parse(lines):
    out, i = [], 0
    while i < len(lines):
        l = lines[i].strip(); i += 1
        m = P1.match(l) or P2.match(l)
        if m: out.append((None, m.group(2))); continue
        m = P4.match(l)
        if m: out.append((clean(m.group(1)), m.group(2))); continue
        m = P3.match(l)
        if m:
            body = []
            while i < len(lines) and not lines[i].strip(): i += 1
            while i < len(lines) and lines[i].strip() and not re.match(r'^(#|\*\*\d|\d+\.)', lines[i].strip()): body.append(lines[i].strip()); i += 1
            out.append((clean(m.group(2)), ' '.join(body)))
    return [(t, clean(s)) for t, s in out if len(clean(s)) >= 15]
def key(s): return re.sub(r'[^a-z#]+', ' ', re.sub(r'\d+(?:[.,]\d+)?', '#', s.lower()))
EXPR = re.compile(r'^((?:[a-z]\s*=\s*-?\d+(?:[.,]\d+)?\s*,?\s*)+)\.\s*(.+?)\s+ni toping\.?$')
def auto_test(s):
    m = EXPR.match(s)
    if not m: return None
    v = {k: (int(x) if re.fullmatch(r'-?\d+', x) else float(x.replace(',', '.'))) for k, x in re.findall(r'([a-z])\s*=\s*(-?[\d.,]+)', m.group(1))}
    e = m.group(2).replace('×', '*').replace('÷', '/').replace('−', '-').replace('–', '-')
    if not re.fullmatch(r'[a-z0-9+\-*/(). ]+', e) or not set(re.findall(r'[a-z]', e)) <= set(v): return None
    try: r = eval(e, {'__builtins__': {}}, dict(v))
    except Exception: return None
    return [{'in': '', 'out': str(int(r)) if float(r).is_integer() else str(round(r, 6))}]
def short(s): return s if len(s) <= 58 else s[:58].rsplit(' ', 1)[0] + '…'
seeds = {}
if os.path.exists('content/seed-input.json'): seeds = {'input': json.load(open('content/seed-input.json'))['classwork']}
seen, total, report = set(), 0, []
os.makedirs(OUT, exist_ok=True)
for f in glob.glob(OUT + '/*.json'): os.remove(f)
for tid, (order, uz, en, lu, le, files) in TOPICS.items():
    pool = []
    for sd in seeds.get(tid, []): seen.add(key(sd['statement']['uz'])); pool.append(sd)
    raw = 0
    for fn in files:
        p = os.path.join(DOCS, fn + '.docx')
        if not os.path.exists(p): continue
        for title, s in parse(extract(p)):
            raw += 1; k = key(s)
            if k in seen: continue
            seen.add(k)
            tests = auto_test(s); n = 101 + len(pool)
            q = {'id': f'{tid}-{n}', 'title': {'uz': title or short(s)}, 'statement': {'uz': s}, 'source': fn, 'judge': {'mode': 'numbers'} if tests else None, 'tests': tests or []}
            if tests: q['tests'][0]['out'] = q['tests'][0]['out']
            pool.append(q)
    cw, hw, ex = pool[:20], pool[20:50], pool[50:]
    json.dump({'id': tid, 'order': order, 'title': {'uz': uz, 'en': en}, 'lesson': {'uz': lu, 'en': le}, 'classwork': cw, 'homework': hw, 'extra': ex},
              open(f'{OUT}/{order:02d}-{tid}.json', 'w'), ensure_ascii=False, indent=1)
    j = sum(1 for q in pool if q['tests']); total += len(pool)
    report.append(f'{tid:11} raw {raw:4}  unique {len(pool):4}  classwork {len(cw):2} homework {len(hw):2} extra {len(ex):3}  auto-judged {j}')
print('\n'.join(report)); print('TOTAL unique problems:', total)
