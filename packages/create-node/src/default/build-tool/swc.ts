import { update as updatePackageJson } from "../create/package-json";
import readRepoFile from "../../util/read-repo-file";
import writeFile from "../../util/write-file";
import { BuildTarget, CreateCommandOptions } from "../../types";

export default async function (options: CreateCommandOptions) {
  const { language, targets, logger, buildTool } = options;
  logger?.verbose(`configuring (generic) ${buildTool}...`);

  const swcRunner = await readRepoFile(
    `../${language}/static/swc-runner.js`,
    options
  );
  await writeFile(".scripts/swc-runner.js", swcRunner, options);

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
              "cross-env BUILD_ENV=browser node .scripts/swc-runner.js",
          }
        : {}),
      ...(targets?.includes("node-cjs")
        ? {
            "build:node-cjs":
              "cross-env BUILD_ENV=node-cjs node .scripts/swc-runner.js",
          }
        : {}),
      ...(targets?.includes("node-esm")
        ? {
            "build:node-esm":
              "cross-env BUILD_ENV=node-esm node .scripts/swc-runner.js",
          }
        : {}),
    },
  }));
}
