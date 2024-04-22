import { CreateCommandOptions } from "../../types";
import readRepoFile from "../../util/read-repo-file";

import test from "./test";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.verbose("deploying jasmine test files...");

  const jasmineSpec = await readRepoFile(
    "../default/static/jasmine.spec.js",
    options
  );
  const jasmineTest = await readRepoFile(
    "../default/static/jasmine.test.js",
    options
  );
  return test(options, jasmineTest, jasmineSpec);
}
