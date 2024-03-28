import { update as updatePackageJson } from "./package-json.js";

export default async function (options) {
  const { targets } = options;

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...(["browser", "bun", "deno"].map((item) => targets.includes(item)).reduce((acc, cur) => acc || cur, false)
        ? {
            "build:browser": "cross-env BUILD_ENV=browser node .scripts/swc-runner.js",
          }
        : {}),
      ...(targets.includes("browser")
        ? { "build:node-cjs": "cross-env BUILD_ENV=node-cjs node .scripts/swc-runner.js" }
        : {}),
      ...(targets.includes("browser")
        ? { "build:node-esm": "cross-env BUILD_ENV=node-esm node .scripts/swc-runner.js" }
        : {}),
    },
  }));
}
