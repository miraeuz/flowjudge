const { _electron } = require("playwright");
const fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict");
(async () => {
  const browser = await _electron.launch({
    args: ["tests/ui-host.cjs", "--no-sandbox", "--ozone-platform=headless"],
  });
  const page = await browser.firstWindow();
  await page.evaluate(() => localStorage.clear());
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const topics = fs
    .readdirSync("content/topics")
    .map((f) => JSON.parse(fs.readFileSync("content/topics/" + f, "utf8")))
    .sort((a, b) => a.order - b.order);
  for (const t of topics)
    for (const p of [...t.classwork, ...t.homework]) {
      p.examples = p.tests
        .filter((x) => !x.hidden)
        .map((x) => ({ in: x.in, out: x.out }));
      p.requiredBlocks = p.judge.requiredBlocks || [];
      delete p.tests;
    }
  await page.addInitScript(
    ({ topics }) => {
      localStorage.lang = "uz";
      localStorage.theme = "light";
      let progress = {},
        attempts = [];
      window.api = {
        status: async () => ({ state: "ok", name: "Mirae student" }),
        topics: async () => topics,
        state: async () => ({ progress, attempts }),
        judge: async (a) => {
          const verdict = a.file.includes("WRONG_OUTPUT") ? "WA" : "AC";
          const key = a.topic + "/" + a.problem;
          if (verdict === "AC") progress[key] = Date.now();
          attempts.push({
            key,
            at: Date.now(),
            verdict,
            passed: verdict === "AC" ? 3 : 0,
            total: 3,
          });
          return {
            verdict,
            passed: verdict === "AC" ? 3 : 0,
            total: 3,
            results: [1, 2, 3].map((n) => ({
              n,
              verdict,
              hidden: n === 3,
            })),
          };
        },
        exportBackup: async () => ({ ok: true }),
        importBackup: async () => ({ ok: true }),
        exportCsv: async () => ({ ok: true }),
      };
    },
    { topics },
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("file://" + path.resolve("renderer/index.html"));
  await page.getByRole("heading", { name: "O‘quv yo‘lingiz" }).waitFor();
  fs.mkdirSync("qa", { recursive: true });
  await page.screenshot({ path: "qa/dashboard-light.png", fullPage: true });
  for (const width of [420, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const hash of [
      "#/",
      "#/map",
      "#/practice",
      "#/t/input",
      "#/t/input/input-01",
      "#/progress",
      "#/settings",
    ]) {
      await page.evaluate((h) => (location.hash = h), hash);
      await page.waitForTimeout(50);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `Horizontal overflow at ${width} ${hash}`,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => (location.hash = "#/practice"));
  await page.locator("#search").fill("Do‘kondagi daftarlar");
  assert.equal(await page.locator(".problem-row").count(), 1);
  await page.locator(".problem-row").click();
  await page.locator("#file").setInputFiles({
    name: "solution.fprg",
    mimeType: "text/xml",
    buffer: fs.readFileSync("tests/reference/input__input-01.fprg"),
  });
  await page.getByRole("heading", { name: "Qabul qilindi" }).waitFor();
  // New learning features: navigation, persistent bookmarks, focus and safe preview.
  await page.locator('[data-action="bookmark"]').click();
  assert.equal(
    await page.locator('[data-action="bookmark"]').getAttribute("aria-pressed"),
    "true",
  );
  await page.locator('[data-action="focus"]').click();
  assert.equal(await page.locator("html").getAttribute("data-focus"), "true");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("html").getAttribute("data-focus"), "false");
  await page.locator('[data-subtab="flow"]').click();
  await page.locator(".flow-node").first().waitFor();
  assert((await page.locator(".flow-node").count()) >= 3);
  await page.setViewportSize({ width: 420, height: 900 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "qa/flowchart-preview.png", fullPage: true });
  const previewChecks = await page.evaluate(() => {
    const P = (b) =>
      `<flowgorithm><function name="Main"><body>${b}</body></function></flowgorithm>`;
    const dangerous = P(
      '<output expression="&lt;img src=x onerror=alert(1)&gt;"/>',
    );
    const box = document.createElement("div");
    box.innerHTML = FlowPreview.render(dangerous, "en");
    const safe =
      box.querySelectorAll("img,script").length === 0 &&
      box.textContent.includes("<img");
    const bad = FlowPreview.render("<!DOCTYPE x><flowgorithm/>", "en").includes(
      "Could not preview",
    );
    const bounded = FlowPreview.render(
      P('<output expression="1"/>'.repeat(500)),
      "en",
    ).includes("abbreviated");
    const branches = FlowPreview.render(
      P(
        '<if expression="a&gt;0"><then><output expression="1"/></then><else><output expression="0"/></else></if>',
      ),
      "en",
    ).includes("flow-branches");
    return { safe, bad, bounded, branches };
  });
  assert.deepEqual(previewChecks, {
    safe: true,
    bad: true,
    bounded: true,
    branches: true,
  });
  await page.locator('[data-subtab="feedback"]').click();
  await page.locator(".next-success").click();
  await page.waitForURL((url) => url.hash === "#/t/input/input-02");
  await page.locator("#file").setInputFiles({
    name: "retry.fprg",
    mimeType: "text/xml",
    buffer: Buffer.from(
      '<flowgorithm><function name="Main"><body><output expression="&quot;WRONG_OUTPUT&quot;"/></body></function></flowgorithm>',
    ),
  });
  await page.locator(".feedback-guide").waitFor();
  await page.evaluate(() => (location.hash = "#/practice"));
  await page.locator("#filter").selectOption("review");
  assert.equal(await page.locator(".problem-row").count(), 1);
  await page.locator("#filter").selectOption("saved");
  assert.equal(await page.locator(".problem-row").count(), 1);
  await page.reload();
  await page.locator("#filter").selectOption("saved");
  assert.equal(
    await page.locator(".problem-row").count(),
    1,
    "bookmark survives reload",
  );
  await page.locator(".problem-row").click();
  await page.locator('[data-action="bookmark"]').click();
  assert.equal(
    await page.locator('[data-action="bookmark"]').getAttribute("aria-pressed"),
    "false",
  );
  await page.evaluate(() => (location.hash = "#/map"));
  await page.locator(".stage-summary").first().waitFor();
  assert.equal(await page.locator(".stage-summary").count(), 4);
  await page.screenshot({ path: "qa/learning-map.png", fullPage: true });
  await page.getByRole("button", { name: "Tilni almashtirish" }).click();
  await page.getByRole("heading", { name: "Your learning path" }).waitFor();
  await page.getByRole("button", { name: "Change language" }).click();
  await page.getByRole("button", { name: "Mavzuni almashtirish" }).click();
  await page.screenshot({ path: "qa/problem-dark.png", fullPage: true });
  await page.evaluate(() => (location.hash = "#/"));
  await page.waitForTimeout(50);
  await page.screenshot({ path: "qa/dashboard-dark.png", fullPage: true });
  await page.setViewportSize({ width: 420, height: 900 });
  await page.screenshot({ path: "qa/dashboard-narrow.png", fullPage: true });
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    "PASS UI routes at four widths, search, bookmarks/reload, focus/Escape, retry filter, next exercise, safe bounded XML preview, learning stages, language/themes and zero page errors. Bridge mocked; native Electron checks are separate.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
