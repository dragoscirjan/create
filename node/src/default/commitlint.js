import writeFile from "../util/write-file.js";

export const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
};

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  const commitlintrc = `// .commitlintrc.js

module.extends = ${JSON.stringify(commitlintConfig, null, 2)};`;

  return writeFile(".commitlintrc.js", commitlintrc, options);
}
