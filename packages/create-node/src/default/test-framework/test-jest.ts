import { CreateCommandOptions } from "../../types";
import readRepoFile from "../../util/read-repo-file";

import test from "./test";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.verbose("deploying jest test files...");

  const jestSpec = await readRepoFile(
    "../default/static/jest.spec.js",
    options
  );
  const jestTest = await readRepoFile(
    "../default/static/jest.test.js",
    options
  );
  return test(options, jestTest, jestSpec);
}
