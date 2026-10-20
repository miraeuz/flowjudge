# FlowJudge — Flowgorithm judge engine (step 2 of the Flowgorithm Academy)

    node tests/run.mjs        # 15 tests, no dependencies (Node 18+)

```js
import { judge } from './engine/fprg.mjs';
const res = judge(fprgXmlText, [{ in: '2\n3', out: '5' }], { mode: 'numbers' });
// -> { verdict: 'AC'|'WA'|'RE'|'TLE'|'CE', passed, total, results: [...] }
```

- Each `Input` block reads one line of test input.
- Judge modes: `tokens` (default), `numbers` (ignores text, good for realistic problems), `exact`.
- Supports Declare, Assign, Input, Output, If, For, While, Do, Call, arrays, user functions,
  `div`/`mod`/`%`/`^`/`&`, `and`/`or`/`not`, common built-ins. Step limit protects from infinite loops.
- Problem file format: `content/topics/03-input.example.json`.
