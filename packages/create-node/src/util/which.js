import { platform } from "os";
import { resolve } from 'import-meta-resolve';
import { stat } from "fs/promises";
import { dirname, join as pathJoin } from 'path';

import spawn from "./spawn.js";
import logger from "./logger.js";

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

/** @param moduleName string */
export async function getModulePath(moduleName, dir = import.meta.url.replace('file://', '')) {
  let stats = null;
  try {
    stats = await stat(dir);
  } catch (e) {
    logger.debug(`Unable to stat ${dir}`, e)
  }
  if (stats) {
    if (stats.isDirectory()) {
      const moduleDir = pathJoin(dir, 'node_modules', moduleName);
      try {
        stats = await stat(moduleDir);
        if (stats && stats.isDirectory()) {
          return moduleDir;
        }
      } catch (e) { }
    }
    if (dir !== dirname(dir)) {
      return getModulePath(moduleName, dirname(dir));
    }
  }
  return resolve(moduleName, import.meta.url);
}
