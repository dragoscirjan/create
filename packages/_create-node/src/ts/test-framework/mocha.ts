import { mochaSpecTs, mochaTestTs } from "../../constants.js";
import mocha, { mochaConfig } from "../../default/test-framework/mocha.js";
import { CreateCommandOptions } from "../../types.js";
import continuePrompt from "../../util/inquire-continue.js";

export default async function (options: CreateCommandOptions) {
  const { language, logger } = options;
  const config = mochaConfig(language!);

  logger?.warn(
    "Current issues with running mocha with TypeScript. Please upgrade " +
      "'@templ-project/create-node' or use a different test runner.",
  );
  await continuePrompt();

  return mocha(
    options,
    {
      ...config,
      require: ["ts-node/register", ...config.require],
    },
    mochaSpecTs,
    mochaTestTs,
  );
}
