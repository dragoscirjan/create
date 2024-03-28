import { mkdir, stat, writeFile } from "fs/promises";
import { dirname, join as joinPath } from "path";

/**
 * @param {string} file
 * @param {string} content
 * @param {{projectPath: string}} options
 */
export default async function (file, content, options) {
  const filePath = joinPath(options.projectPath, file);

  try {
    const stats = await stat(dirname(filePath));
    if (stats.isDirectory()) {
      throw new Error("");
    }
  } catch (e) {
    await mkdir(dirname(filePath), { recursive: true });
  }

  return writeFile(filePath, typeof content === "string" ? content : JSON.stringify(content, null, 2));
}
