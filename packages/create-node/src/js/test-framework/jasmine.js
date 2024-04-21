import readRepoFile from "../../util/read-repo-file.js";

import jasmine from "../../default/jasmine.js";
import writeFile from "../../util/write-file.js";

export default async function (options) {
  const jasmineConfig = await readRepoFile("../../js/static/.jasmine-babel.js");
  await writeFile(".jasmine/babel.js", jasmineConfig, options);

  return jasmine(options);
}
