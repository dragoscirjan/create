import { readFile } from "fs/promises";

import test from "./test.js";

export default async function (options) {
  const mochaSpec = await readFile(new URL("static/mocha.spec.js", import.meta.url).pathname, "utf-8").then((buffer) =>
    buffer.toString("utf-8"),
  );
  const mochaTest = await readFile(new URL("static/mocha.test.js", import.meta.url).pathname, "utf-8").then((buffer) =>
    buffer.toString("utf-8"),
  );
  return test(options, mochaTest, mochaSpec);
}
