import readRepoFile from "../util/read-repo-file.js";

import test from "./test.js";

export default async function (options) {
  const vitestSpec = await readRepoFile("../js/static/vitest.spec.js");
  const vitestTest = await readRepoFile("../js/static/vitest.test.js");
  return test(options, vitestTest, vitestSpec);
}
