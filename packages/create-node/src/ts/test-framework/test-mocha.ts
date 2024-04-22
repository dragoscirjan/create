import readRepoFile from "../../util/read-repo-file";

import test from "../../default/test-framework/test";
import { CreateCommandOptions } from "../../types";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.verbose("deploying mocha (typescript) test files...");

  const mochaSpec = await readRepoFile("../ts/static/mocha.spec.ts", options);
  const mochaTest = await readRepoFile("../ts/static/mocha.test.ts", options);
  return test(options, mochaTest, mochaSpec);
}
