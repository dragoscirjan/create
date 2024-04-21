import { mkdir, stat } from "fs/promises";
import { join as joinPath } from "path";
import { rimraf } from "rimraf";

import writeFile from "../../util/write-file.js";

const noCode = "// no code";

/**
 * @param options {{
      language: 'js' | 'ts' | 'coffee',
      projectPath: string
    }}
 * @param config {object}
 */
export default async function (options, test = noCode, spec = noCode) {
  const { language, projectPath, logger } = options;
  logger.verbose(`writing default test files...`);

  const codePath = joinPath(projectPath, "test");
  try {
    const stats = await stat(codePath);
    if (stats.isDirectory()) {
      console.log("src folder alread exists; moving on");
    } else {
      await rimraf(codePath);
    }
  } catch (e) {}
  await mkdir(codePath, { recursive: true });

  await writeFile(joinPath("test", `index.test.${language}`), test, options);
  return writeFile(joinPath("src", `index.spec.${language}`), spec, options);
}
