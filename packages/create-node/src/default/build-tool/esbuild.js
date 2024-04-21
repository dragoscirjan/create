import { update as updatePackageJson } from "../package-json.js";
import readRepoFile from "../../util/read-repo-file.js";
import writeFile from "../../util/write-file.js";

export default async function (options) {
  const { targets, language, logger, buildTool } = options;
  logger.verbose(`configuring (${language}) ${buildTool}...`);

  const esbuildRunner = await readRepoFile(`../${language}/static/esbuild-runner.js`);
  await writeFile(".scripts/esbuild-runner.js", esbuildRunner, options);

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...(["browser", "bun", "deno"].map((item) => targets.includes(item)).reduce((acc, cur) => acc || cur, false)
        ? {
            "build:browser": "cross-env BUILD_ENV=browser node .scripts/esbuild-runner.js",
          }
        : {}),
      ...(targets.includes("browser")
        ? { "build:node-cjs": "cross-env BUILD_ENV=node-cjs node .scripts/esbuild-runner.js" }
        : {}),
      ...(targets.includes("browser")
        ? { "build:node-esm": "cross-env BUILD_ENV=node-esm node .scripts/esbuild-runner.js" }
        : {}),
    },
  }));
}
