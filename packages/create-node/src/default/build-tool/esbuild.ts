import { update as updatePackageJson } from "../create/package-json";
import readRepoFile from "../../util/read-repo-file";
import writeFile from "../../util/write-file";
import { BuildTarget, CreateCommandOptions } from "../../types";

export default async function (options: CreateCommandOptions) {
  const { targets, language, logger, buildTool } = options;
  logger?.verbose(`configuring (${language}) ${buildTool}...`);

  const esbuildRunner = await readRepoFile(
    `../${language}/static/esbuild-runner.js`,
    options
  );
  await writeFile(".scripts/esbuild-runner.js", esbuildRunner, options);

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...((["browser", "bun", "deno"] as BuildTarget[])
        .map((item) => targets?.includes(item))
        .reduce((acc, cur) => acc || cur, false)
        ? {
            "build:browser":
              "cross-env BUILD_ENV=browser node .scripts/esbuild-runner.js",
          }
        : {}),
      ...(targets?.includes("browser")
        ? {
            "build:node-cjs":
              "cross-env BUILD_ENV=node-cjs node .scripts/esbuild-runner.js",
          }
        : {}),
      ...(targets?.includes("browser")
        ? {
            "build:node-esm":
              "cross-env BUILD_ENV=node-esm node .scripts/esbuild-runner.js",
          }
        : {}),
    },
  }));
}
