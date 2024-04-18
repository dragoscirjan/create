import logger from "./util/logger.js";

export const allLanguages = ["js", "ts", "coffee"];
export const allBuildTools = ["esbuild", "rollup", "swc"];
export const allPackageManagers = ["npm", "pnpm", "yarn"];
export const allQualityTools = ["eslint", "oxlint", "prettier", "jscpd", "dependency-cruiser", "license-checker", "audit"];
export const allTargets = ["browser", "bun", "deno", "node-cjs", "node-esm"];
export const allTestFrameworks = ["ava", "deno", "mocha", "jasmine", "jest", "vitest"];

export async function run(language, runner, options) {
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

