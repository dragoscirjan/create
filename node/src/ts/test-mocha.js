import readRepoFile from "../util/read-repo-file.js";

import test from "../default/test.js";

export default async function (options) {
  const mochaSpec = await readRepoFile("../ts/static/mocha.spec.ts");
  const mochaTest = await readRepoFile("../ts/static/mocha.test.ts");
  return test(options, mochaTest, mochaSpec);
}
