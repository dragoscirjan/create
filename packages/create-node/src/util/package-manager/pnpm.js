import { stat } from "fs/promises";
import { join as joinPath } from "path";

import spawn from "../spawn.js";
import { whichPnpm } from "../which.js";
import continuePrompt from "../inquire-continue.js";

/** @param options {{projectPath: string}} */
export async function init(options) {
  try {
    const stats = await stat(joinPath(options.projectPath, "package.json"));
    if (stats.isFile()) {
      console.warn(`Folder already contains files; Cannot overwrite...`);
      await continuePrompt();
    }
  } catch (e) {}

  const binary = await whichPnpm();
  return spawn([binary, "init"], { cwd: options.projectPath, stdio: "inherit" });
}

/**
 * @param packages string[]
 * @param options {{projectPath: string, save?: boolean, saveDev?: boolean, savePeer?: boolean, force?: boolean}}
 */
export async function install(packages, options) {
  const { force, projectPath, saveDev } = options;
  const binary = await whichPnpm();
  const args = [binary, "add"];

  // Determine the type of dependency to save
  if (saveDev) {
    args.push("-D");
  }

  // savePeer is not supported by pnpm

  args.push(...packages);

  if (force) {
    // args.push("--force");
    args.push("--legacy-peer-deps");
  }

  spawn(args, { cwd: projectPath, stdio: "inherit" });
}
