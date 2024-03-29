import { readFile } from "fs/promises";

import test from "./test.js";

export default async function (options) {
  const jestSpec = await readFile(new URL("static/jest.spec.js", import.meta.url).pathname, "utf-8").then((buffer) =>
    buffer.toString("utf-8"),
  );
  const jestTest = await readFile(new URL("static/jest.test.js", import.meta.url).pathname, "utf-8").then((buffer) =>
    buffer.toString("utf-8"),
  );
  return test(options, jestTest, jestSpec);
}
