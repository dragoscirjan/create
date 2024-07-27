import { execa, Options } from "execa";
import { logger } from "./logger.js";

export const installDependencies = async (
  packageManager: string,
  modules: string[],
  options: Options = {},
) => {
  logger.debug(`Installing dev dependencies: ${modules.join(", ")} ...`);
  await execa(
    packageManager,
    [...(packageManager === "npm" ? ["install", "-S"] : ["add"]), ...modules],
    {
      stdout: ["pipe", "inherit"],
      ...options,
    },
  );
  logger.debug(`${modules.join(", ")} installed`);
};

export const installDevDependencies = async (
  packageManager: string,
  modules: string[],
  options: Options = {},
) => {
  logger.debug(`Installing dev dependencies: ${modules.join(", ")} ...`);
  await execa(
    packageManager,
    [...(packageManager === "npm" ? ["install"] : ["add"]), "-D", ...modules],
    {
      stdout: ["pipe", "inherit"],
      ...options,
    },
  );
  logger.debug(`${modules.join(", ")} installed`);
};
