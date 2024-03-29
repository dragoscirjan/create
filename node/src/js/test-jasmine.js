import readRepoFile from "../util/read-repo-file.js";

import test from "./test.js";

export default async function (options) {
  const jasmineSpec = await readRepoFile("../js/static/jasmine.spec.js");
  const jasmineTest = await readRepoFile("../js/static/jasmine.test.js");
  return test(options, jasmineTest, jasmineSpec);
}
