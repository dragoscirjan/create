import { writeFile } from "fs/promises";
import { join as joinPath } from "path";

/**
 * @param {string} file
 * @param {string} content
 * @param {{projectPath: string}} options
 */
export default async function (file, content, options) {
  return writeFile(
    joinPath(options.projectPath, file),
    typeof content === "string" ? content : JSON.stringify(content, null, 2),
  );
}
