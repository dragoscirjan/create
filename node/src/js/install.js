import install from "../default/install.js";

/** @param options {{
      language: 'js' | 'ts' | 'coffee',
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: string[],
      testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest',
      qualityTools: string[]
    }} */
const buildPackageList = (options) => {
  const { packageManager, buildTool, testFramework } = options;

  return [
    "@babel/cli",
    "@babel/core",
    "@babel/eslint-parser",
    "@babel/preset-env",
    "@babel/register",
    // test framework specific
    ...(testFramework === "ava" ? ["@ava/babel"] : []),
    ...(testFramework === "jest" ? ["babel-jest"] : []),
    // builder specific
    ...(buildTool === "esbuild" ? ["esbuild-plugin-babel"] : []),
    ...(buildTool === "rollup" ? ["@rollup/plugin-babel"] : []),
  ];
};

/** @param options {{
      language: 'js' | 'ts' | 'coffee',
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: string[],
      testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest',
      qualityTools: string[]
    }} */
export default async function (options) {
  await install(options);

  const { packageManager, buildTool, testFramework } = options;
  const { install: pmInstall } = await import(`../util/package-manager/${packageManager}.js`);
  return pmInstall(buildPackageList(options), {
    ...options,
    saveDev: true,
  });
}
