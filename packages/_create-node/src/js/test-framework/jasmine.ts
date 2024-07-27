import readRepoFile from "../../util/read-repo-file.js";

import jasmine from "../../default/test-framework/jasmine.js";
import writeFile from "../../util/write-file.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  const jasmineConfig = await readRepoFile(
    "../../js/static/.jasmine-babel.js",
    options,
  );
  await writeFile(".jasmine/babel.js", jasmineConfig, options);

  return jasmine(options);
}
