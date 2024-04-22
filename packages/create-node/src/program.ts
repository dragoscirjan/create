import { Command } from "commander";
import { resolve } from "path";
import logger from "../src/util/logger";
import readFile from "../src/util/read-file";
import createAction, { createOptionsValidate } from "../src/commands/create";
import buildAction from "../src/commands/build";
import {
  BuildCommandOptions,
  CreateCommandOptions,
  QualityTool,
} from "../src/types";

import {
  allBuildTools,
  allLanguages,
  allPackageManagers,
  allQualityTools,
  allTargets,
  allTestFrameworks,
} from "./constants";

const program = new Command();

program
  .argument("<projectPath>", "Project Path")
  .option(
    "-l, --language <language>",
    `Programming Language to use: ${allLanguages.join(", ")}`,
    "ts"
  )
  .option(
    "-t, --targets <targets...>",
    `Module's target: ${allTargets.join(", ")} or all`,
    "all"
  )
  .option(
    "--package-manager <packageManger>",
    `Package Manager to use: ${allPackageManagers.join(", ")}`,
    "npm"
  )
  .option(
    "--test-framework <testFramework>",
    `Testing Framework to use: ${allTestFrameworks.join(", ")}`,
    "jest"
  )
  .option(
    "--quality-tools <qualityTools...>",
    `Quality Tools to use: ${allQualityTools.join(", ")} or all`,
    "all"
  )
  .option(
    "--build-tool <buildTool>",
    `Build Tool to use: ${allBuildTools.join(", ")}`
  )
  .action(
    async (
      projectPath: string,
      options: CreateCommandOptions & {
        qualityTools: QualityTool[] | string;
        targets: string[] | string;
      }
    ) => {
      options = {
        ...options,
        // TODO: coffee not supported yet
        buildTool:
          options.buildTool || (options.language === "ts" ? "tsc" : "babel"),
        logger,
        projectPath: resolve(projectPath),
        qualityTools:
          options.qualityTools === "all"
            ? allQualityTools
            : options.qualityTools,
        targets:
          options.targets === "all" || options.targets?.includes("all")
            ? allTargets
            : options.targets,
      };

      createOptionsValidate(options);

      logger.debug(`Creating project at ${projectPath} with options:`, options);

      return createAction(options);
    }
  );

program
  .command("build")
  .description("Build the project")
  .option(
    "--build-tool <buildTool>",
    `Build Tool to use: ${allBuildTools.join(", ")}`
  )
  .action(async (options: BuildCommandOptions) => {
    const projectPath = process.cwd();

    options = {
      ...options,
      projectPath,
      logger,
    };

    await readFile(".createrc", options).then((data) => {
      const json = JSON.parse(data);
      options = {
        ...options,
        ...json,
        // TODO: coffee not supported yet
        buildTool:
          options.buildTool || json.language === "ts" ? "tsc" : "babel",
      };
    });

    logger.debug(`Building project at ${projectPath} with options:`, options);

    return buildAction(options);
  });

export default program;
