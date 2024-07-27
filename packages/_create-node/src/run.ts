import { GenericCommandOptions } from "./types.js";
import logger from "./util/logger.js";

// eslint-disable-next-line max-params
export default async function run<T extends GenericCommandOptions>(
  language: string,
  runner: string,
  options: T,
  count = 0,
) {
  let localRun;

  try {
    // const m = await import(`./${language}/${runner}`);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const m = require(`./${language}/${runner}`);
    logger.debug(`resolving ${language}/${runner} ...`);
    localRun = m.default;
  } catch (e) {
    logger.debug(`./${language}/${runner} not found`, e);
    if (count === 0) {
      return run("default", runner, options, count + 1);
    }
  }

  return localRun(options);
}
