import logger from "./util/logger.js";

export default async function run(language, runner, options) {
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
