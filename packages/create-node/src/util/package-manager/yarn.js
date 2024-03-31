import spawn from "../spawn.js";
import { whichYarn } from "../which.js";

export async function init(cwd = process.cwd()) {
  const binary = await whichYarn();
  await spawn([binary, "init"], { cwd });
}
