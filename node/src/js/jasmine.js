import { readFile } from "fs/promises";

import jasmine from "../default/jasmine.js";
import writeFile from "../util/write-file.js";

export default async function (options) {
  const jasmineConfig = await readFile(new URL("static/.jasmine-babel.js", import.meta.url).pathname, "utf-8").then(
    (buffer) => buffer.toString("utf-8"),
  );
  await writeFile(".jasmine/babel.js", jasmineConfig, options);

  return jasmine(options);
}
