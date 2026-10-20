import { parentPort, workerData } from "node:worker_threads";
import { judge } from "./fprg.mjs";
parentPort.postMessage(
  judge(workerData.file, workerData.tests, workerData.options),
);
