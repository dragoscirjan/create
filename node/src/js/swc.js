import { readFile } from "fs/promises";

import swc from "../default/swc.js";
import writeFile from "../util/write-file.js";

export default async function (options) {
  await swc(options);

  const swcRunner = await readFile(new URL("static/swc-runner.js", import.meta.url).pathname, "utf-8").then((buffer) =>
    buffer.toString("utf-8"),
  );
  return writeFile(".scripts/swc-runner.js", swcRunner, options);
}
