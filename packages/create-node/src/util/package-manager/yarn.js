import spawn from "../spawn.js";
import { whichYarn } from "../which.js";

export async function init(cwd = process.cwd()) {
  const binary = await whichYarn();
  await spawn([binary, "init"], { cwd });
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
