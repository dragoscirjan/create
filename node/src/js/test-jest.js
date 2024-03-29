import readRepoFile from "../util/read-repo-file.js";

import test from "./test.js";

export default async function (options) {
  const jestSpec = await readRepoFile("../js/static/jest.spec.js");
  const jestTest = await readRepoFile("../js/static/jest.test.js");
  return test(options, jestTest, jestSpec);
}
