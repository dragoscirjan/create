import { CreateCommandOptions } from "../../types";
import readRepoFile from "../../util/read-repo-file";

import test from "./test";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.verbose("deploying jest vitest files...");

  const vitestSpec = await readRepoFile(
    "../default/static/vitest.spec.js",
    options
  );
  const vitestTest = await readRepoFile(
    "../default/static/vitest.test.js",
    options
  );
  return test(options, vitestTest, vitestSpec);
}
