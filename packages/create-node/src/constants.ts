import {
  BuildTarget,
  BuildTool,
  PackageManager,
  ProgrammingLanguage,
  QualityTool,
  TestFramework,
} from "./types";

export const allLanguages: ProgrammingLanguage[] = ["js", "ts" /*, "coffee" */];

export const allBuildTools: BuildTool[] = [
  "babel",
  "esbuild",
  "rollup",
  "swc",
  "tsc",
];

export const allPackageManagers: PackageManager[] = ["npm", "pnpm", "yarn"];

export const allQualityTools: QualityTool[] = [
  // "eslint",
  // "oxlint",
  // "prettier",
  // "jscpd",
  "dependency-cruiser",
  // "license-checker",
  // "audit",
];

export const allTargets: BuildTarget[] = [
  "browser",
  "bun",
  "deno",
  "node-cjs",
  "node-esm",
];

export const allTestFrameworks: TestFramework[] = [
  "ava",
  "deno",
  "mocha",
  "jasmine",
  "jest",
  "vitest",
];
