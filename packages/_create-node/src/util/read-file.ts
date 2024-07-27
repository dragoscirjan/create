import { readFile } from "fs/promises";
import { join as joinPath } from "path";
import { GenericCommandOptions } from "../types.js";

// eslint-disable-next-line consistent-return
export default async function <T extends GenericCommandOptions>(
  file: string,
  options: T,
): Promise<string> {
  const { projectPath, logger } = options;
  const filePath = joinPath(projectPath!, file);

  logger?.debug(`reading ${filePath}...`);
  try {
    return await readFile(filePath).then((buffer) => buffer.toString("utf-8"));
  } catch (e) {
    throw new Error(`Unable to read ${filePath}`, { cause: e });
  }
}
