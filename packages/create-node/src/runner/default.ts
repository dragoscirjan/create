import fs from "fs/promises";
import path from "path";

import {
  logger,
  // installDependencies,
  // installDevDependencies,
} from "@templ-project/core";
import { execa } from "execa";

import { ProgramOptions } from "../options.js";
import huskySetup from "../tools/husky.js";
import PackageJson from "@npmcli/package-json";

const runner = async (projectPath: string, options: ProgramOptions) => {
  await initProject(projectPath, options);

  // await installDeps(projectPath, options);

  await huskySetup(projectPath, options);
};

export default runner;

const initProject = async (projectPath: string, options: ProgramOptions) => {
  logger.debug("Running project init...");
  await fs.mkdir(path.resolve(projectPath), { recursive: true });
  if (!process.env.SKIP_PM_INIT) {
    await execa(options.packageManager, ["init"], {
      cwd: projectPath,
      stdio: ["inherit", "inherit", "inherit"],
      // stout: ["inherit", "inherit", "inherit"],
    });
  } else {
    await new PackageJson().create(projectPath).save();
  }
  logger.debug("Project init completed...");
};

// const installDeps = async (projectPath: string, options: ProgramOptions) => {
//   logger.debug("Installing dependencies...");
//   await installDependencies(
//     options.packageManager,
//     [
//       "@templ-project/core",
//       "@templ-project/code-analysis",
//       "@templ-project/code-build",
//     ],
//     {
//       cwd: projectPath,
//     },
//   );
//   await installDevDependencies(options.packageManager, [], {
//     cwd: projectPath,
//   });
// };
