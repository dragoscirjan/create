import { update as updatePackageJson } from "../default/package-json.js";

/** @param options {{
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: string[],
      testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest',
      qualityTools: string[]
    }} */
const buildPackageList = ({ qualityTools, testFramework, buildTool, targets }) => {
  return [
    "@commitlint/cli",
    "@commitlint/config-conventional",
    "core-js",
    "cross-env",
    "globby",
    "husky",
    "nodemon",
    "npm-run-all2",
    "nyc",
    "release-it",
    "release-please",
    "rimraf",
    // quality tools
    ...(qualityTools.includes("dependency-cruiser") ? ["dependency-cruiser"] : []),
    ...(qualityTools.includes("eslint") ? ["eslint", "eslint-plugin-sonar", "eslint-plugin-sonarjs"] : []),
    ...(qualityTools.includes("jscpd") ? ["jscpd", "@jscpd/badge-reporter"] : []),
    ...(qualityTools.includes("license-checker") ? ["license-checker"] : []),
    ...(qualityTools.includes("oxlint") ? ["oxlint"] : []),
    ...(qualityTools.includes("prettier")
      ? [
          "import-sort-style-module",
          "prettier",
          "prettier-plugin-import-sort",
          ...(qualityTools.includes("eslint")
            ? ["eslint-config-prettier", "eslint-plugin-import", "eslint-plugin-prettier"]
            : []),
        ]
      : []),
    // test frameworks
    ...(testFramework.includes("ava")
      ? ["ava", ...(qualityTools.includes("eslint") ? ["eslint-plugin-ava"] : [])]
      : []),
    ...(testFramework.includes("jasmine") ? ["jasmine"] : []),
    ...(testFramework.includes("jest")
      ? ["jest", ...(qualityTools.includes("eslint") ? ["eslint-plugin-jest"] : [])]
      : []),
    ...(testFramework.includes("mocha")
      ? ["chai", "mocha", ...(qualityTools.includes("eslint") ? ["eslint-plugin-mocha"] : [])]
      : []),
    ...(testFramework.includes("vitest") ? ["vitest"] : []),
    // languages specific
    // ...(language === "coffee" ? [] : []),
    // ...(language === "ts"
    //   ? [
    //       "typescript",
    //       "ts-node",
    //       "tslib",
    //       "@types/node",
    //       "@istanbuljs/nyc-config-typescript",
    //       ...(testFramework.includes("eslint")
    //         ? ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"]
    //         : []),
    //       ...(testFramework.includes("jest") ? ["ts-jest", "@types/jest"] : []),
    //       ...(testFramework.includes("mocha") ? ["@types/chai", "@types/mocha"] : []),
    //     ]
    //   : []),
    // builder specific
    ...(buildTool === "esbuild" || targets.includes("browser") || targets.includes("deno") ? ["esbuild"] : []),
    ...(buildTool === "rollup" || targets.includes("browser") || targets.includes("deno") ? ["rollup"] : []),
    ...(buildTool === "rollup"
      ? [
          "@rollup/plugin-commonjs",
          "@rollup/plugin-node-resolve",
          // ...(language === "ts" ? ["@rollup/plugin-typescript"] : []),
        ]
      : []),
    ...(buildTool === "swc" ? ["@swc/cli", "@swc/core"] : []),
  ];
};

/** @param options {{
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: string[],
      testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest',
      qualityTools: string[]
    }} */
export default async function (options) {
  const { packageManager, targets } = options;
  const pm = await import(`../util/package-manager/${packageManager}.js`);
  await pm.install(buildPackageList(options), {
    ...options,
    saveDev: true,
  });

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      main: "dist/node-cjs/index.js",
      exports: {
        ".": {
          ...(targets.includes("browser") ? { browser: "./dist/browser/index.js" } : {}),
          ...(targets.includes("bun") ? { bun: "./dist/browser/index.js" } : {}),
          ...(targets.includes("deno") ? { deno: "./dist/worker/index.js" } : {}),
          ...(targets.includes("node-esm") ? { import: "./dist/node/node-esm/index.js" } : {}),
          ...(targets.includes("node-cjs") ? { require: "./dist/node/node-cjs/index.js" } : {}),
          ...(targets.includes("worker") ? { worker: "./dist/browser/index.js" } : {}),
        },
      },
      ...packageObject.scripts,
      clean: "rimraf ./dist",
      prepare: "husky",
      release: "run-s release:*",
      "release:release-it": "release-it --ci --no-npm.publish",
      "release:release-please": "release-please",
    },
  }));
}
