import { readFile } from "fs/promises";

import esbuild from "../default/esbuild.js";
import writeFile from "../util/write-file.js";

export default async function (options) {
  await esbuild(options);

  const esbuildRunner = await readFile(new URL("static/esbuild-runner.js", import.meta.url).pathname, "utf-8").then(
    (buffer) => buffer.toString("utf-8"),
  );
  return writeFile(".scripts/esbuild-runner.js", esbuildRunner, options);
}
