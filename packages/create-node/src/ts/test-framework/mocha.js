import mocha, { mochaConfig } from "../../default/mocha.js";
import continuePrompt from "../../utils/inquire-continue.js";

export default async function (options) {
  const { language, logger } = options;
  const config = mochaConfig(language);

  logger.warn(
    `Current issues with running mocha with TypeScript. Please upgrade '@templ-project/create-node' or use a different test runner.`,
  );
  await continuePrompt();

  return mocha(options, {
    ...config,
    require: ["ts-node/register", ...config.require],
  });
}
