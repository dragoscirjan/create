import readRepoFile from "../util/read-repo-file.js";

import swc from "../default/swc.js";
import writeFile from "../util/write-file.js";

export default async function (options) {
  const { logger, buildTool } = options;
  logger.verbose(`configuring (babel) ${buildTool}...`);

  await swc(options);

  const swcRunner = await readRepoFile("../js/static/swc-runner.js");
  return writeFile(".scripts/swc-runner.js", swcRunner, options);
}
