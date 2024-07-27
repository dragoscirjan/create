import { join as joinPath } from "path";

import spawn from "../util/spawn.js";
import readFile from "../util/read-file.js";
import writeFile from "../util/write-file.js";
import { GenericCommandOptions } from "../types.js";

export const configureCommitLint = async <T extends GenericCommandOptions>(
  options: T,
): Promise<void> => {
  const { logger } = options;

  const commitLintPath = joinPath(".husky", "commit-msg");
  let commitLint = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"`;

  try {
    commitLint = await readFile(commitLintPath, options).then((buffer) =>
      buffer.toString(),
    );
  } catch (e) {
    logger?.warn(`unable to read ${commitLintPath} file: ${e.message}`, e);
  }
  await writeFile(
    commitLintPath,
    `${commitLint}

npx commitlint --edit $1`,
    options,
  );
};

export const configurePreCommit = async <T extends GenericCommandOptions>(
  options: T,
): Promise<void> => {
  const { logger } = options;

  const preCommitPath = joinPath(".husky", "pre-commit");
  let preCommit = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"`;

  try {
    preCommit = await readFile(preCommitPath, options).then((buffer) =>
      buffer.toString(),
    );
  } catch (e) {
    logger?.warn(`unable to read ${preCommitPath} file: ${e.message}`, e);
  }
  await writeFile(
    preCommitPath,
    `${preCommit}

npm run ca
npm run test
npm run build

git add -u`,
    options,
  );
};

const ensureGitFolder = async <T extends GenericCommandOptions>(
  options: T,
): Promise<void> => {
  return spawn(["git", "init"], {
    cwd: options.projectPath,
    stdio: "inherit",
  }) as Promise<void>;
};

export default async function <T extends GenericCommandOptions>(
  options: T,
): Promise<void> {
  const { projectPath } = options;

  await ensureGitFolder(options);
  await spawn(["./node_modules/.bin/husky"], {
    cwd: projectPath,
    stdio: "inherit",
  });

  await configureCommitLint(options);
  await configurePreCommit(options);
}
