import readRepoFile from "../../util/read-repo-file";

import test from "../../default/test-framework/test";
import { CreateCommandOptions } from "../../types";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.verbose("deploying jest (typescript) test files...");

  const jestSpec = await readRepoFile(
    "../default/static/jest.spec.js",
    options
  );
  const jestTest = await readRepoFile("../ts/static/jest.test.ts", options);
  return test(options, jestTest, jestSpec);
}
