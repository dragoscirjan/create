import readRepoFile from "../util/read-repo-file.js";

import { update as updatePackageJson } from "../default/package-json.js";
import rollup from "../default/rollup.js";
import writeFile from "../util/write-file.js";

export default async function (options) {
  const { targets, logger, buildTool } = options;
  logger.verbose(`configuring (babel) ${buildTool}...`);

  await rollup(options);

  const rollupConfig = await readRepoFile("../js/static/rollup.config.js");
  await writeFile("rollup.config.js", rollupConfig, options);

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
      ...(targets.includes("node-cjs")
        ? { "build:node-cjs": "cross-env BUILD_ENV=node-cjs ROLLUP_BUILD=1 rollup -c" }
        : {}),
      ...(targets.includes("node-esm") ? { "build:node-esm": "cross-env BUILD_ENV=node-esm rollup -c" } : {}),
    },
  }));
}
