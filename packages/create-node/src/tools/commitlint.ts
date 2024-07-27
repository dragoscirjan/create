/**
 * @link https://commitlint.js.org/
 * @link https://github.com/conventional-changelog/commitlint
 * @link https://www.npmjs.com/package/commitlint
 */

import { installDevDependencies, logger } from "@templ-project/core";
import { writeFile } from "fs/promises";
import path from "path";

import { ProgramOptions } from "../options.js";

const commitLintSetup = async (
  projectPath: string,
  options: ProgramOptions,
) => {
  logger.debug("Setting up `commitlint`...");

  await installDevDependencies(
    options.packageManager,
    ["@commitlint/cli", "@commitlint/config-conventional"],
    {
      cwd: projectPath,
    },
  );

  await ensureCommitLinkConfig(projectPath);

  logger.debug("`commitlint`setup completed...");
};

export default commitLintSetup;

export const commitLintConfig = `// .commitlint.js

module.exports = {
  extends: ['@commitlint/config-conventional'],
};

`;

const ensureCommitLinkConfig = async (projectPath: string) =>
  writeFile(path.join(projectPath, ".commitlinkrc.js"), commitLintConfig);
