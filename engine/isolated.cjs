const { Worker } = require("node:worker_threads");
const path = require("node:path");
exports.isolatedJudge = (file, tests, options = {}, timeout = 5000) =>
  new Promise((resolve) => {
    let done = false;
    const worker = new Worker(path.join(__dirname, "worker.mjs"), {
      workerData: { file, tests, options },
      resourceLimits: {
        maxOldGenerationSizeMb: 64,
        maxYoungGenerationSizeMb: 16,
        stackSizeMb: 4,
      },
    });
    const finish = (result) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      worker.terminate();
      resolve(result);
    };
    const failure = (verdict, message) => ({
      verdict,
      message,
      passed: 0,
      total: tests.length,
      results: [],
    });
    const timer = setTimeout(
      () => finish(failure("TLE", "Submission exceeded the execution limit")),
      timeout,
    );
    worker.once("message", finish);
    worker.once("error", () =>
      finish(
        failure("RE", "Submission exceeded resources or could not execute"),
      ),
    );
    worker.once("exit", () => {
      if (!done) finish(failure("RE", "Submission stopped unexpectedly"));
    });
  });
