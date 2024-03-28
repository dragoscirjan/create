import { platform } from "os";

import spawn from "./spawn.js";

/** @param binary string */
export default async function which(binary) {
  if (platform() === "win32") {
    return spawn(["where", binary]).then((b) => b.trim());
  }
  return spawn(["which", binary]).then((b) => b.trim());
}

export const whichNode = () => which("node");
export const whichNpm = () => which("npm");
export const whichPnpm = () => which("pnpm");
export const whichYarn = () => which("yarn");
