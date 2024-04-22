import { CreateCommandOptions } from "../../types";
import readRepoFile from "../../util/read-repo-file";

import test from "./test";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.verbose("deploying jest test files...");

  const mochaSpec = await readRepoFile(
    "../default/static/mocha.spec.js",
    options
  );
  const mochaTest = await readRepoFile(
    "../default/static/mocha.test.js",
    options
  );
  return test(options, mochaTest, mochaSpec);
}
