import { join as joinPath } from "path";

import spawn from "../util/spawn.js";
import readFile from "../util/read-file.js";
import writeFile from "../util/write-file.js";

export const configureCommitLint = async (options) => {
  const commitLintPath = joinPath(".husky", "_", "commit-msg");
  let commitLint = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"`;

  try {
    commitLint = await readFile(commitLintPath, options).then((buffer) => buffer.toString());
  } catch (e) {}
  await writeFile(
    commitLintPath,
    `${commitLint}

echo npx commitlint --edit $1`,
    options,
  );
};

export const configurePreCommit = async (options) => {
  const preCommitPath = joinPath(".husky", "_", "pre-commit");
  let preCommit = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"`;

  try {
    preCommit = await readFile(preCommitPath, options).then((buffer) => buffer.toString());
  } catch (e) {}
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

const ensureGitFolder = async (options) => {
  return spawn(["git", "init"], { cwd: options.projectPath, stdio: "inherit" });
};

export default async function (options) {
  await ensureGitFolder(options);
  await spawn(["./node_modules/.bin/husky"], { cwd: options.projectPath, stdio: "inherit" });

  await configureCommitLint(options);
  await configurePreCommit(options);
}
