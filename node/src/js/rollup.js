import { readFile } from "fs/promises";

import { update as updatePackageJson } from "../default/package-json.js";
import rollup from "../default/rollup.js";
import writeFile from "../util/write-file.js";

export default async function (options) {
  await rollup(options);

  const rollupConfig = await readFile(new URL("static/rollup.config.js", import.meta.url).pathname, "utf-8").then(
    (buffer) => buffer.toString("utf-8"),
  );
  await writeFile("rollup.config.js", rollupConfig, options);

  const { targets } = options;
  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...(["browser", "bun", "deno"].map((item) => targets.includes(item)).reduce((acc, cur) => acc || cur, false)
        ? {
            "build:browser": "cross-env BUILD_ENV=browser rollup -c",
          }
        : {}),
      ...(targets.includes("browser") ? { "build:node-cjs": "cross-env BUILD_ENV=node-cjs rollup -c" } : {}),
      ...(targets.includes("browser") ? { "build:node-esm": "cross-env BUILD_ENV=node-esm rollup -c" } : {}),
    },
  }));
}
