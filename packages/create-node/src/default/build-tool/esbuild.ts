import { update as updatePackageJson } from "../create/package-json";
import readRepoFile from "../../util/read-repo-file";
import writeFile from "../../util/write-file";
import { BuildTarget, CreateCommandOptions } from "../../types";
import { getBuildableTargets } from "../targets";

export default async function (options: CreateCommandOptions) {
  const { targets, language, logger, buildTool, useDefaultCommands } = options;
  logger?.verbose(`configuring (${language}) ${buildTool}...`);

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...getBuildableTargets(targets)
        .map((target) => ({
          [`build:${target}`]: useDefaultCommands
            ? `babel src --config-file ./.babelrc.${target.replace(
                "node-",
                ""
              )}.js --out-dir dist/${target} --extensions ".js"`
            : `create-node build --target ${target} --build-tool ${buildTool}`,
        }))
        .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    },
  }));
}
