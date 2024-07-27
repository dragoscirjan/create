import { mkdir, writeFile } from "fs/promises";
import { dirname, join as joinPath } from "path";
import { GenericCommandOptions } from "../types.js";

export default async function <T extends GenericCommandOptions>(
  file: string,
  content: string | Record<string, unknown>,
  { projectPath, logger }: T,
) {
  const filePath = joinPath(projectPath!, file);

  logger?.debug(`making sure ${dirname(filePath)} exists...`);
  try {
    await mkdir(dirname(filePath), { recursive: true });
  } catch (e) {
    throw new Error(`Unable to create folder ${dirname(filePath)}`, {
      cause: e,
    });
  }

  logger?.debug(`writing ${filePath}...`);
  try {
    return writeFile(
      filePath,
      typeof content === "string" ? content : JSON.stringify(content, null, 2),
    );
  } catch (e) {
    throw new Error(`Unable to write ${filePath}`, { cause: e });
  }
}
