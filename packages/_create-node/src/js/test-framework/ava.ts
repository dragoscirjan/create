import readRepoFile from "../../util/read-repo-file.js";

import ava from "../../default/test-framework/ava.js";
import writeFile from "../../util/write-file.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  const avaConfig = await readRepoFile(
    "../../js/static/ava.config.js",
    options,
  );
  await writeFile("ava.config.js", avaConfig, options);

  return ava(options);
}
