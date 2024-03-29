import { update as updatePackageJson } from "./package-json.js";

export default async function (options) {
  const { logger } = options;
  logger.info("cpdating package.json for browser build...");

  return updatePackageJson(options, (object) => ({
    ...object,
    exports: {
      ...(object.exports || {}),
      ".": {
        ...(object.exports?.["."] || {}),
        browser: "./dist/browser/index.js",
        worker: "./dist/browser/index.js",
      },
    },
    scripts: {
      ...object.scripts,
      "build:node-esm":
        object.scripts?.["build:node-esm"]?.replace(/\s?&& node .scripts\/esm-module.js/gi, "") +
        " && node .scripts/esm-module.js",
    },
  }));
}
