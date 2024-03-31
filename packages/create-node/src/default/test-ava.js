import readRepoFile from "../util/read-repo-file.js";

import test from "./test.js";

export default async function (options) {
  const avaSpec = await readRepoFile("../default/static/ava.spec.js");
  const avaTest = await readRepoFile("../default/static/ava.test.js");
  return test(options, avaTest, avaSpec);
}
