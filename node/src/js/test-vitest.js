import { readFile } from "fs/promises";

import test from "./test.js";

export default async function (options) {
  const vitestSpec = await readFile(new URL("static/vitest.spec.js", import.meta.url).pathname, "utf-8").then(
    (buffer) => buffer.toString("utf-8"),
  );
  const vitestTest = await readFile(new URL("static/vitest.test.js", import.meta.url).pathname, "utf-8").then(
    (buffer) => buffer.toString("utf-8"),
  );
  return test(options, vitestTest, vitestSpec);
}
