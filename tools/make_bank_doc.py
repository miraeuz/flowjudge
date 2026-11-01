#!/usr/bin/env python3
"""Worksheet document for the For / While / Array banks, built from content/bank2.py."""
import sys; sys.path.insert(0, 'content'); from bank2 import BANKS
OUT = sys.argv[1]; N = {'for': 'For — sanoqli tsikl', 'while': 'While — shartli tsikl', 'array': 'Array — massivlar'}
def fmt(v): return ' / '.join(map(fmt, v)) if isinstance(v, (list, tuple)) else (str(int(v)) if isinstance(v, float) and float(v).is_integer() else str(round(v, 6)) if isinstance(v, float) else str(v))
s = ['# For, While va Array — masalalar to\'plami\n*Mirae Academy created this*\n\nHar bir masala hayotiy, formulasiz va avtomatik tekshiriladi. Kirish qiymatlari har bir qatorda alohida kiritiladi. “Namuna” — tekshiruvdan olingan.\n']
for tid, (L, H, X) in BANKS.items():
    s.append(f'\n---\n# {N[tid]}\n'); n = 1
    for title, rows in (('Dars mashg\'uloti', L), ('Uyga vazifa', H), ('Qo\'shimcha', X)):
        s.append(f'\n## {title} — {len(rows)} ta\n')
        for pid, t, st, fn, cases in rows:
            a, b = cases[0], cases[1]
            s.append(f'**{n}. {t}**  \n{st}  \n*Namuna:* kirish `{" ".join(map(str, a))}` → chiqish `{fmt(fn(*a))}`; kirish `{" ".join(map(str, b))}` → chiqish `{fmt(fn(*b))}`\n'); n += 1
open(OUT, 'w').write('\n'.join(s)); print(OUT, len(' '.join(s).split()), 'words')
