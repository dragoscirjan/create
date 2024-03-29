import readRepoFile from "../util/read-repo-file.js";

import esbuild from "../default/esbuild.js";
import writeFile from "../util/write-file.js";

export default async function (options) {
  const { logger, buildTool } = options;
  logger.verbose(`configuring (babel) ${buildTool}...`);

  await esbuild(options);

  const esbuildRunner = await readRepoFile("../js/static/esbuild-runner.js");
  return writeFile(".scripts/esbuild-runner.js", esbuildRunner, options);
}
