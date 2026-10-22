import { readdirSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { judge } from "../engine/fprg.mjs";
const dir = new URL("../content/topics/", import.meta.url);
let count = 0;
const topics = new Set(),
  ids = new Set();
for (const file of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const t = JSON.parse(readFileSync(new URL(file, dir), "utf8"));
  assert(!topics.has(t.id));
  topics.add(t.id);
  assert.equal(t.classwork.length, 20);
  assert.equal(t.homework.length, 30);
  for (const p of [...t.classwork, ...t.homework]) {
    const id = t.id + "/" + p.id;
    assert(!ids.has(id));
    ids.add(id);
    for (const field of ["title", "statement", "inputFormat", "outputFormat"])
      for (const lang of ["uz", "en"])
        assert(p[field]?.[lang], id + " missing " + field + "." + lang);
    assert(
      p.tests.filter((x) => !x.hidden).length === 2,
      id + " requires two examples",
    );
    assert(p.tests.some((x) => x.hidden));
    for (const test of p.tests) {
      assert.equal(typeof test.in, "string", id + " invalid input");
      assert.equal(typeof test.out, "string", id + " invalid output");
    }
    const xml = readFileSync(
      new URL(`reference/${t.id}__${p.id}.fprg`, import.meta.url),
      "utf8",
    );
    const result = judge(xml, p.tests, p.judge);
    assert.equal(
      result.verdict,
      "AC",
      id + " reference rejected: " + JSON.stringify(result),
    );
    const wrong = xml.replace(
      /<output expression="[^"]*"/g,
      '<output expression="&quot;WRONG_OUTPUT&quot;"',
    );
    assert.notEqual(
      judge(wrong, p.tests, p.judge).verdict,
      "AC",
      id + " accepts wrong output",
    );
    count++;
  }
}
assert.equal(count, 800);
assert.equal(topics.size, 16);
console.log(
  `PASS ${count} reference solutions, ${count} wrong solutions, bilingual fields and 20/30 counts across ${topics.size} topics`,
);
