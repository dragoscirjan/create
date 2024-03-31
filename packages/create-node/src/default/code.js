import { mkdir, stat } from "fs/promises";
import { join as joinPath } from "path";
import { rimraf } from "rimraf";

import readRepoFile from "../util/read-repo-file.js";
import writeFile from "../util/write-file.js";

/**
 * @param options {{
      language: 'js' | 'ts' | 'coffee',
      projectPath: string
    }}
 * @param config {object}
 */
export default async function (options) {
  const { language, logger, projectPath } = options;

  logger.verbose("creating src/ ...");

  const codePath = joinPath(projectPath, "src");
  try {
    const stats = await stat(codePath);
    if (stats.isDirectory()) {
      console.log("src folder alread exists; moving on");
    } else {
      await rimraf(codePath);
    }
  } catch (e) {}
  await mkdir(codePath, { recursive: true });

  const code = await readRepoFile(`../${language}/static/index.${language}`);
  return writeFile(joinPath("src", `index.${language}`), code, options);
}
