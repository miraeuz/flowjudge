const { _electron } = require("playwright");
const fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict");
(async () => {
  const browser = await _electron.launch({
    args: ["tests/ui-host.cjs", "--no-sandbox", "--ozone-platform=headless"],
  });
  const page = await browser.firstWindow();
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
      let progress = {};
      window.api = {
        status: async () => ({ state: "ok", name: "Mirae student" }),
        topics: async () => topics,
        state: async () => ({ progress, attempts: [] }),
        judge: async (a) => {
          progress[a.topic + "/" + a.problem] = Date.now();
          return {
            verdict: "AC",
            passed: 3,
            total: 3,
            results: [1, 2, 3].map((n) => ({
              n,
              verdict: "AC",
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
  await page
    .locator("#file")
    .setInputFiles({
      name: "solution.fprg",
      mimeType: "text/xml",
      buffer: Buffer.from("<flowgorithm/>"),
    });
  await page.getByRole("heading", { name: "Qabul qilindi" }).waitFor();
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
    "PASS UI routes at four widths, search, submission state, themes, zero page errors. Bridge mocked; native Electron checks are separate.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
