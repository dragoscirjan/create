import { readFile } from "fs/promises";

import test from "./test.js";

export default async function (options) {
  const jasmineSpec = await readFile(new URL("static/jasmine.spec.js", import.meta.url).pathname, "utf-8").then(
    (buffer) => buffer.toString("utf-8"),
  );
  const jasmineTest = await readFile(new URL("static/jasmine.test.js", import.meta.url).pathname, "utf-8").then(
    (buffer) => buffer.toString("utf-8"),
  );
  return test(options, jasmineTest, jasmineSpec);
}
