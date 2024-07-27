import { GenericCommandOptions } from "../types.js";
import writeFile from "../util/write-file.js";

export default async function <T extends GenericCommandOptions>(
  options: T,
): Promise<void> {
  const createRc = {
    ...options,
  };

  for (const item of [
    "logger",
    "projectPath",
    "packageManager",
    "testFramework",
    "qualityTools",
  ]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (createRc as any)[item];
  }

  return writeFile(".createrc", createRc, options);
}
