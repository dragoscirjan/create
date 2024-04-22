import { CreateCommandOptions } from "../../types";
import readRepoFile from "../../util/read-repo-file";

import test from "./test";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.verbose("deploying ava test files...");

  const avaSpec = await readRepoFile("../default/static/ava.spec.js", options);
  const avaTest = await readRepoFile("../default/static/ava.test.js", options);
  return test(options, avaTest, avaSpec);
}
