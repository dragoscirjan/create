import readRepoFile from "../../util/read-repo-file.js";

import ava from "../../default/ava.js";
import writeFile from "../../util/write-file.js";

export default async function (options) {
  const avaConfig = await readRepoFile("../../js/static/ava.config.js");
  await writeFile("ava.config.js", avaConfig, options);

  return ava(options);
}
