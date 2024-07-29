import { writeFile } from "fs/promises";
import { ProgramOptions } from "../options.js";
import path from "path";

const rcSetup = async (
  projectPath: string,
  {
    language,
    target,
    packageManager,
    testFramework,
    transpiler,
    bundler,
  }: ProgramOptions,
) =>
  writeFile(
    path.join(projectPath, ".createrc"),
    JSON.stringify(
      { language, target, packageManager, testFramework, transpiler, bundler },
      null,
      2,
    ),
  );

export default rcSetup;
