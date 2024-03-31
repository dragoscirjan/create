import { mkdir, stat } from "fs/promises";
import { join as joinPath } from "path";

import spawn from "../spawn.js";
import which from "../which.js";
import continuePrompt from "../inquire-continue.js";

const createMockPackageJson = async (options) =>
  process.env.SKIP_NPM_INIT
    ? writeFile(
        joinPath(options.projectPath, "package.json"),
        JSON.stringify({
          devDependencies: {},
          scripts: {},
        }),
        options,
      )
    : null;

/** @param options {{projectPath: string}} */
export async function init(options) {
  try {
    const stats = await stat(joinPath(options.projectPath, "package.json"));
    if (stats.isFile()) {
      console.warn(`Project folder already exists.`);
      await continuePrompt();
    }
  } catch (e) {}

  const { projectPath, logger } = options;
  logger.verbose(`creating ${projectPath}...`);
  await mkdir(projectPath, { recursive: true });

  await createMockPackageJson(options);

  const { packageManager } = options;
  return which(packageManager).then((binary) =>
    spawn([binary, "init"], { cwd: options.projectPath, stdio: "inherit" }),
  );
}
