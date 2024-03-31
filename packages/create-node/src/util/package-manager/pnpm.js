import spawn from "../spawn.js";
import { whichPnpm } from "../which.js";

export async function init(cwd = process.cwd()) {
  const binary = await whichPnpm();
  await spawn([binary, "init"], { cwd });
}
