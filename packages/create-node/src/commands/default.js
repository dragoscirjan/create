import run from "../run.js";

export const allLanguages = ["js", "ts", "coffee"];
export const allBuildTools = ["esbuild", "rollup", "swc"];
export const allPackageManagers = ["npm", "pnpm", "yarn"];
export const allQualityTools = [
  "eslint",
  "oxlint",
  "prettier",
  "jscpd",
  "dependency-cruiser",
  "license-checker",
  "audit",
];
export const allTargets = ["browser", "bun", "deno", "node-cjs", "node-esm"];
export const allTestFrameworks = ["ava", "deno", "mocha", "jasmine", "jest", "vitest"];

/**
 * @param projectPath {string}
 * @param options {{
      language: 'js' | 'ts' | 'coffee',
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: ('browser' | 'bun' | 'deno' | 'node-csj' | 'node-esm')[],
      testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest',
      qualityTools: ('audit', 'eslint' | 'oxlint', )[],
      projectPath: string
    }}
 */
export default async function (_projectPath, options) {
  const { language, qualityTools, buildTool, testFramework, targets } = options;

  const runners = [
    // project init
    "package-json",

    // npm i
    "install",

    // deploy code
    "code",

    // deploy tests
    `test-framework/${testFramework}`,
    `test-framework/test-${testFramework}`,

    // deploy validate stuff
    "commitlint",
    "editorconfig",

    // deploy builder
    ...(language === "coffee" ? [] : []),
    ...(language === "js" || (language === "ts" && testFramework === "jasmine") ? ["build-tool/babel"] : []),
    ...(language === "ts" ? ["build-tool/tsc"] : []),
    ...(buildTool ? [`build-tool/${buildTool}`] : []),

    // deploy target settings
    ...targets.map((t) => `targets/${t}`),

    // deploy quality tools
    ...qualityTools.map((qt) => `quality-tools/${qt}`),

    // git
    "husky",

    // create
    "createrc",
  ];
  for (const runner of runners) {
    await run(language, runner, options);
  }
}
