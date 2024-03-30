import { program } from "commander";
import { resolve } from "path";

import logger from "./util/logger.js";

const allBuildTools = ["esbuild", "rollup", "swc"];
const allLanguages = ["cofee", "js", "ts"];
const allPackageManagers = ["npm", "pnpm", "yarn"];
const allQualityTools = ["eslint", "oxlint", "prettier", "jscpd", "dependency-cruiser", "license-checker", "audit"];
const allTargets = ["browser", "bun", "deno", "node-cjs", "node-esm"];
const allTestFrameworks = ["ava", "deno", "mocha", "jasmine", "jest", "vitest"];

async function run(language, runner, options) {
  try {
    const { default: irun } = await import(`./${language}/${runner}.js`);
    logger.info(`resolving ${language}/${runner} ...`);
    return irun(options);
  } catch (error) {
    logger.debug(`./${language}/${runner}.js not found`);
    logger.debug(`error: ${error.message} \n ${error.stack}`);

    return run("default", runner, options);
  }
}

program
  .argument("<projectPath>", "Project Path")
  .option("-l, --language <language>", `Programming Language to use: ${allLanguages.join(", ")}`, "ts")
  .option("-t, --targets <targets...>", `Module's target: ${allTargets.join(", ")} or all`, "all")
  .option("--package-manager <packageManger>", `Package Manager to use: ${allPackageManagers.join(", ")}`, "npm")
  .option("--test-framework <testFramework>", `Testing Framework to use: ${allTestFrameworks.join(", ")}`, "jest")
  .option("--quality-tools <qualityTools...>", `Quality Tools to use: ${allQualityTools.join(", ")} or all`, "all")
  .option("--build-tool <buildTool>", `Build Tool to use: ${allBuildTools.join(", ")}`)
  .action(
    /**
     * @param projectPath {string}
     * @param options {{
          language: 'js' | 'ts' | 'coffee',
          packageManager: 'npm' | 'pnpm' | 'yarn',
          targets: string[],
          testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest',
          qualityTools: string[],
          projectPath: string
        }}
     */ async (projectPath, options) => {
      options = {
        ...options,
        projectPath: resolve(projectPath),
        qualityTools: options.qualityTools === "all" ? allQualityTools : options.qualityTools,
        targets: options.targets === "all" || options.targets?.includes("all") ? allTargets : options.targets,
        logger,
      };
      // console.log(options);
      // process.exit(0);

      const { language, qualityTools, buildTool, testFramework, targets } = options;

      const runners = [
        // project init
        "package-json",

        // npm i
        "install",

        // deploy code
        "code",
        // deploy tests
        testFramework,
        `test-${testFramework}`,
        // deploy validate stuff
        "commitlint",
        "editorconfig",
        // deploy builder
        ...(language === "coffee" ? [] : []),
        ...(language === "js" || (language === "ts" && testFramework === "jasmine") ? ["babel"] : []),
        ...(language === "ts" ? ["tsc"] : []),
        ...(buildTool ? [buildTool] : []),
        // deploy target settings
        ...targets,
        // deploy quality tools
        ...qualityTools,
      ];
      for (const runner of runners) {
        await run(language, runner, options);
      }
    },
  )
  .parse();
