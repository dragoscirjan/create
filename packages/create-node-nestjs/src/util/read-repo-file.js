import { readFile } from "fs/promises";

/**
 * @param {string} file
 */
export default async function (file) {
  try {
    return readFile(new URL(file, import.meta.url).pathname, "utf-8").then((buffer) => buffer.toString("utf-8"));
  } catch (error) {
    logger.error(`error reading ${filePath}`);
    logger.debug(`error: ${error.message}\n\n ${error.stack}`);
    process.exit(1);
  }
}
