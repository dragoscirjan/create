import { update as updatePackageJson } from "../create/package-json.js";
import { BuildTarget, CreateCommandOptions } from "../../types.js";
import { getBuildableTargets } from "../targets/index.js";
import { generateBuildCommand } from "./index.js";

export default async function (options: CreateCommandOptions) {
  const { targets, language, logger, buildTool, useDefaultCommands } = options;
  logger?.verbose(`configuring (${language}) ${buildTool}...`);

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...getBuildableTargets(targets)
        .map((target: BuildTarget) => ({
          [`build:${target}`]: useDefaultCommands
            ? `esbuild src/**/*.js ${language === "ts" ? "--loader=ts" : ""} --outdir=dist/${target} --target="es2020,${
                target !== "browser"
                  ? "node16"
                  : "chrome58,edge16,firefox57,safari11"
              }" --format=${target === "node-cjs" ? "cjs" : "esm"}`
            : generateBuildCommand({ target, buildTool: "esbuild" }),
        }))
        .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    },
  }));
}
