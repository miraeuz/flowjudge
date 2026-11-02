#!/usr/bin/env python3
"""Computes tests for every problem listed in content/refs.py from its reference solution (run after import_problems.py)."""
import json, glob, sys
sys.path.insert(0, 'content'); from refs import R
def fmt(v):
    if isinstance(v, bool): return str(v)
    if isinstance(v, float): return str(int(v)) if v.is_integer() else str(round(v, 10))
    return str(v)
used, report, errs = set(), [], []
for f in sorted(glob.glob('content/topics/*.json')):
    t = json.load(open(f)); n = tot = 0
    for p in t['classwork'] + t['homework'] + t.get('extra', []):
        tot += 1
        if p['id'] not in R: continue
        fn, cases = R[p['id']]; used.add(p['id'])
        if len(cases) < 4: errs.append(f"{p['id']}: need >= 4 cases")
        tests, words = [], False
        for i, c in enumerate(cases):
            try: out = fmt(fn(*c))
            except Exception as e: errs.append(f"{p['id']} {c}: {e}"); continue
            words |= not out.lstrip('-').replace('.', '', 1).isdigit()
            tests.append({'in': '\n'.join(fmt(x) for x in c), 'out': out, **({'hidden': True} if i >= 2 else {})})
        if p['tests'] and p['judge']: continue          # keep existing (hand-made / auto) tests
        p['tests'], p['judge'] = tests, {'mode': 'tokens' if words else 'numbers'}; n += 1
    json.dump(t, open(f, 'w'), ensure_ascii=False, indent=1)
    report.append(f"{t['id']:11} + {n:3} checkers from refs")
missing = set(R) - used
if missing: errs.append('refs for unknown problem ids: ' + ', '.join(sorted(missing)))
print('\n'.join(report)); print('ERRORS:' if errs else 'all reference solutions ran OK'); print('\n'.join(errs))
sys.exit(1 if errs else 0)
