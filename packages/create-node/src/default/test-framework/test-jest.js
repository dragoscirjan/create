import readRepoFile from "../../util/read-repo-file.js";

import test from "./test.js";

export default async function (options) {
  const { logger } = options;
  logger.verbose("deploying jest test files...");

  const jestSpec = await readRepoFile("../default/static/jest.spec.js");
  const jestTest = await readRepoFile("../default/static/jest.test.js");
  return test(options, jestTest, jestSpec);
}
