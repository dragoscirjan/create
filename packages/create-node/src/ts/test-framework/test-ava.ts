import readRepoFile from "../../util/read-repo-file";

import test from "../../default/test-framework/test";
import { CreateCommandOptions } from "../../types";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.verbose("deploying ava (typescript) test files...");

  const avaSpec = await readRepoFile("../default/static/ava.spec.js", options);
  const avaTest = await readRepoFile("../ts/static/ava.test.ts", options);
  return test(options, avaTest, avaSpec);
}
