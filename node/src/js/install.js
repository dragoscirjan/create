import install from "../default/install.js";

/** @param options {{
      language: 'js' | 'ts' | 'coffee',
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: string[],
      testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest',
      qualityTools: string[]
    }} */
export default async function (options) {
  await install(options);

  const { packageManager, buildTool, testFramework, language } = options;
  const pm = await import(`../util/package-manager/${packageManager}.js`);
  return pm.install(
    [
      "@babel/cli",
      "@babel/core",
      "@babel/preset-env",
      "@babel/register",
      // test framework specific
      ...(testFramework === "ava" ? ["@ava/babel"] : []),
      ...(testFramework === "jest" ? ["babel-jest"] : []),
      // builder specific
      ...(buildTool === "esbuild" ? ["esbuild-plugin-babel"] : []),
      ...(buildTool === "rollup" ? ["@rollup/plugin-babel"] : []),
    ],
    {
      ...options,
      saveDev: true,
    },
  );
}
