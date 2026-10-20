import assert from "node:assert/strict";
import { judge, compare } from "../engine/fprg.mjs";
import { isolatedJudge } from "../engine/isolated.cjs";
const P = (b) =>
  `<flowgorithm><function name="Main" type="None" variable=""><body>${b}</body></function></flowgorithm>`;
const tests = [{ in: "SECRET_VALUE_4782", out: "1", hidden: true }];
const bad = P(
  '<declare name="a" type="Integer" array="False"/><input variable="a"/>',
);
assert(!JSON.stringify(judge(bad, tests)).includes("SECRET_VALUE_4782"));
for (const xml of [
  P("").replace("</body>", "</if>"),
  P("").slice(0, -14),
  P("") + P(""),
  P("<unknown/>"),
  "<!DOCTYPE x>" + P(""),
])
  assert.equal(judge(xml, [{ in: "", out: "" }]).verdict, "CE");
assert.equal(
  judge(P('<output expression="1/0"/>'), [{ in: "", out: "" }]).verdict,
  "RE",
);
assert.equal(
  judge(P('<output expression="Sqrt(-1)"/>'), [{ in: "", out: "" }]).verdict,
  "RE",
);
assert.equal(
  judge(P('<output expression="1"/>'), [{ in: "", out: "1" }], {
    requireArray: true,
  }).verdict,
  "CE",
);
assert.equal(
  judge(P('<output expression="1"/>'), [{ in: "", out: "1" }], {
    requiredFunction: "Calculate",
  }).verdict,
  "CE",
);
assert(compare("1e-7", "0.0000001"));
const xml = P('<while expression="True"/>');
const began = Date.now();
let ticks = 0;
const timer = setInterval(() => ticks++, 10);
const result = await isolatedJudge(
  xml,
  [{ in: "", out: "" }],
  { maxSteps: 1e12 },
  150,
);
clearInterval(timer);
assert.equal(result.verdict, "TLE");
assert(Date.now() - began < 2000);
assert(ticks > 2, "event loop must stay responsive");
const healthy = await isolatedJudge(
  P('<output expression="42" newline="True"/>'),
  [{ in: "", out: "42" }],
);
assert.equal(healthy.verdict, "AC");
console.log(
  "PASS hidden-input redaction, malformed XML, unsupported blocks, non-finite arithmetic, structural checks, worker timeout, event-loop responsiveness, recovery",
);
