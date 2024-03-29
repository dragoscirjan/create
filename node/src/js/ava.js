import { readFile } from "fs/promises";

import ava from "../default/ava.js";
import writeFile from "../util/write-file.js";

export default async function (options) {
  const avaConfig = await readFile(new URL("static/ava.config.js", import.meta.url).pathname, "utf-8").then((buffer) =>
    buffer.toString("utf-8"),
  );
  await writeFile("ava.config.js", avaConfig, options);

  return ava(options);
}
