import { mkdir, stat, writeFile } from "fs/promises";
import { dirname, join as joinPath } from "path";

/**
 * @param {string} file
 * @param {string} content
 * @param {{projectPath: string}} options
 */
export default async function (file, content, options) {
  const { projectPath, logger } = options;

  const filePath = joinPath(projectPath, file);

  try {
    const stats = await stat(dirname(filePath));
    if (stats.isDirectory()) {
      throw new Error("");
    }
  } catch (e) {
    await mkdir(dirname(filePath), { recursive: true });
  }

  logger.verbose(`writing ${filePath}...`);
  try {
    return writeFile(filePath, typeof content === "string" ? content : JSON.stringify(content, null, 2));
  } catch (error) {
    logger.error(`error writing ${filePath}`);
    logger.debug(`error: ${error.message}\n\n ${error.stack}`);
    process.exit(1);
  }
}
