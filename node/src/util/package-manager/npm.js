import { stat } from "fs/promises";
import { join as joinPath } from "path";

import spawn from "../spawn.js";
import { whichNpm } from "../which.js";
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

  const binary = await whichNpm();
  return spawn([binary, "init"], { cwd: options.projectPath, stdio: "inherit" });
}

/**
 * @param packages string[]
 * @param options {{projectPath: string, save?: boolean, saveDev?: boolean, savePeer?: boolean}}
 */
export async function install(packages, options) {
  const binary = await whichNpm();
  return spawn(
    [
      binary,
      "install",
      ...[
        options.save
          ? ["-S"]
          : options.saveDev
            ? ["-D"]
            : options.savePeer
              ? [
                  /* TODO: add args */
                ]
              : [],
      ],
      ...packages,
      "--legacy-peer-deps",
    ],
    { cwd: options.projectPath, stdio: "inherit" },
  );
}
