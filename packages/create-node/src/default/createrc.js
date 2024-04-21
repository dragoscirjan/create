import writeFile from "../util/write-file.js";

/**
 * @param projectPath {string}
 * @param options {{
      language: 'js' | 'ts' | 'coffee',
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: ('browser' | 'bun' | 'deno' | 'node-csj' | 'node-esm')[],
      testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest',
      qualityTools: ('audit', 'eslint' | 'oxlint', )[]
    }}
 */
export default async function (options) {
  const createRc = {
    ...options,
  };

  for (const item of ["logger", "projectPath", "packageManager", "testFramework", "qualityTools"]) {
    delete createRc[item];
  }

  return writeFile(".createrc", JSON.stringify(createRc, null, 2), options);
}
