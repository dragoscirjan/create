import { GenericCommandOptions } from "./types";
import logger from "./util/logger";

export default async function run<T extends GenericCommandOptions>(
  language: string,
  runner: string,
  options: T
) {
  try {
    const { default: irun } = await import(`./${language}/${runner}`);
    logger.info(`resolving ${language}/${runner} ...`);
    return irun(options);
  } catch (error: any) {
    logger.debug(`./${language}/${runner} not found`);
    logger.debug(`error: ${error.message} \n ${error.stack}`);

    return run("default", runner, options);
  }
}
