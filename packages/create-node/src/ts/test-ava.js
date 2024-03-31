import readRepoFile from "../util/read-repo-file.js";

import test from "../default/test.js";

export default async function (options) {
  const { logger } = options;
  logger.verbose("deploying ava (typescript) test files...");

  const avaSpec = await readRepoFile("../default/static/ava.spec.js");
  const avaTest = await readRepoFile("../ts/static/ava.test.ts");
  return test(options, avaTest, avaSpec);
}
