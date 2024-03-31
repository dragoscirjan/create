import { init as genericInit } from "./generic.js";
import spawn from "../spawn.js";
import { whichYarn } from "../which.js";

/** @param options {{projectPath: string}} */
export async function init(options) {
  return genericInit(options);
}

/**
 * @param packages string[]
 * @param options {{projectPath: string, save?: boolean, saveDev?: boolean, savePeer?: boolean, force?: boolean}}
 */
export async function install(packages, options) {
  const { force, projectPath, saveDev } = options;
  const binary = await whichYarn();
  const args = [binary, "add"];

  if (saveDev) {
    args.push("-D");
  }

  args.push(...packages);

  if (force) {
    // TODO: haven't decided how to handle this yet
  }

  return spawn(args, { cwd: projectPath, stdio: "inherit" });
}
