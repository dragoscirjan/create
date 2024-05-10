import { mkdir, stat, writeFile } from "fs/promises";
import { dirname, join as joinPath } from "path";
import { GenericCommandOptions } from "../types";

export default async function <T extends GenericCommandOptions>(
  file: string,
  content: string | Record<string, unknown>,
  { projectPath, logger }: T,
) {
  ensureFolderExists(file, { projectPath });
  ensureFileWrite(file, content, { projectPath, logger });
}

async function ensureFolderExists<T extends GenericCommandOptions>(
  file: string,
  { projectPath }: T,
): Promise<void> {
  const filePath = joinPath(projectPath!, file);
  try {
    const stats = await stat(dirname(filePath));
    if (stats.isDirectory()) {
      throw new Error("");
    }
  } catch (e) {
    await mkdir(dirname(filePath), { recursive: true });
  }
}

async function ensureFileWrite<T extends GenericCommandOptions>(
  file: string,
  content: string | Record<string, unknown>,
  { projectPath, logger }: T,
): Promise<void> {
  const filePath = joinPath(projectPath!, file);
  logger?.verbose(`writing ${filePath}...`);
  try {
    return writeFile(
      filePath,
      typeof content === "string" ? content : JSON.stringify(content, null, 2),
    );
  } catch (error: Error) {
    logger?.error(`error writing ${filePath}`);
    logger?.debug(`error: ${error.message}\n\n ${error.stack}`);
    process.exit(1);
  }

  return undefined;
}
