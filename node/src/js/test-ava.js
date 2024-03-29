import { readFile } from "fs/promises";

import test from "./test.js";

export default async function (options) {
  const avaSpec = await readFile(new URL("static/ava.spec.js", import.meta.url).pathname, "utf-8").then((buffer) =>
    buffer.toString("utf-8"),
  );
  const avaTest = await readFile(new URL("static/ava.test.js", import.meta.url).pathname, "utf-8").then((buffer) =>
    buffer.toString("utf-8"),
  );
  return test(options, avaTest, avaSpec);
}
