import { mkdir, stat } from "fs/promises";
import { join as joinPath } from "path";
import { rimraf } from "rimraf";

import writeFile from "../util/write-file.js";

const noCode = "// no code";

/**
 * @param options {{
      language: 'js' | 'ts' | 'coffee',
      projectPath: string
    }}
 * @param config {object}
 */
export default async function (options, code = noCode) {
  const { projectPath, logger } = options;

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

  return writeFile(joinPath("src", "index.js"), code, options);
}
