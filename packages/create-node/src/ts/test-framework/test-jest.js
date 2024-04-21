import readRepoFile from "../../util/read-repo-file.js";

import test from "../../default/test.js";

export default async function (options) {
  const { logger } = options;
  logger.verbose("deploying jest (typescript) test files...");

  const jestSpec = await readRepoFile("../default/static/jest.spec.js");
  const jestTest = await readRepoFile("../ts/static/jest.test.ts");
  return test(options, jestTest, jestSpec);
}
