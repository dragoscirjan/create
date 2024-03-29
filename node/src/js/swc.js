import { readFile } from "fs/promises";

import swc from "../default/swc.js";
import writeFile from "../util/write-file.js";

export default async function (options) {
  const swcRunner = await readFile(new URL("static/swc-runner.js", import.meta.url).pathname, "utf-8").then((buffer) =>
    buffer.toString("utf-8"),
  );
  await writeFile(".scripts/swc-runner.js", swcRunner, options);

  return swc(options);
}
