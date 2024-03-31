import { init as genericInit } from "./generic.js";
import spawn from "../spawn.js";
import { whichPnpm } from "../which.js";

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
    // args.push("--legacy-peer-deps");
  }

  return spawn(args, { cwd: projectPath, stdio: "inherit" });
}
