import readRepoFile from "../../util/read-repo-file.js";

import test from "./test.js";

export default async function (options) {
  const mochaSpec = await readRepoFile("../default/static/mocha.spec.js");
  const mochaTest = await readRepoFile("../default/static/mocha.test.js");
  return test(options, mochaTest, mochaSpec);
}
