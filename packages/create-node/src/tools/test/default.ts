import { mkdir } from "fs/promises";
import { ProgramOptions } from "../../options.js";
import path from "path";
import { installDevDependencies } from "@templ-project/core";

const testSetup = async (projectPath: string, options: ProgramOptions) => {
  await mkdir(path.join(projectPath, "src"), { recursive: true });
  await mkdir(path.join(projectPath, "test"), { recursive: true });

  return installDevDependencies(options.packageManager, ["cross-env"], {
    cwd: projectPath,
  });
};

export default testSetup;
