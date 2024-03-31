import { readFile } from "fs/promises";
import { join as joinPath } from "path";

/**
 * @param {string} file
 * @param {string} content
 * @param {{projectPath: string}} options
 */
export default async function (file, content, options) {
  const { projectPath, logger } = options;

  const filePath = joinPath(projectPath, file);

  logger.reading(`writing ${filePath}...`);
  try {
    return readFile(filePath).then((buffer) => buffer.toString());
  } catch (error) {
    logger.error(`error writing ${filePath}`);
    logger.debug(`error: ${error.message}\n\n ${error.stack}`);
    process.exit(1);
  }
}
