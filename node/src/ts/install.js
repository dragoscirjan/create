import install from "../default/install.js";
import { requiresSinon } from "../util/test-framework.js";

/** @param options {{
      language: 'js' | 'ts' | 'coffee',
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: string[],
      testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest',
      qualityTools: string[]
    }} */
const buildPackageList = (options) => {
  const { buildTool, testFramework, qualityTools } = options;

  return [
    "typescript",
    "ts-node",
    "tslib",
    "@types/node",
    "@istanbuljs/nyc-config-typescript",
    // test framework specific
    ...(requiresSinon(testFramework) ? ["@types/sinon"] : []),
    ...(testFramework === "ava" ? ["tsimp"] : []),
    ...(testFramework === "jasmine"
      ? [
          "@babel/cli",
          "@babel/core",
          "@babel/preset-env",
          "@babel/register",
          "@babel/plugin-transform-typescript",
          "jasmine",
        ]
      : []),
    ...(testFramework === "jest" ? ["ts-jest", "@types/jest"] : []),
    ...(testFramework === "mocha" ? ["@types/chai", "@types/mocha"] : []),
    // quality tools specific
    ...(qualityTools.includes("eslint") ? ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"] : []),
    // builder specific
    ...(buildTool === "esbuild" ? ["esbuild-plugin-babel"] : []),
    ...(buildTool === "rollup" ? ["@rollup/plugin-typescript"] : []),
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

  const { packageManager, logger } = options;

  logger.info("Installing TypeScript dependencies...");

  const { install: pmInstall } = await import(`../util/package-manager/${packageManager}.js`);
  return pmInstall(buildPackageList(options), {
    ...options,
    saveDev: true,
  });
}
