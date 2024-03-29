import { update as updatePackageJson } from "./package-json.js";

export default async function (options) {
  const { logger } = options;
  logger.info("cpdating package.json for Node.js CSJ build...");

  return updatePackageJson(options, (object) => ({
    ...object,
    main: "dist/node-cjs/index.js",
    exports: {
      ...(object.exports || {}),
      ".": {
        ...(object.exports?.["."] || {}),
        require: "./dist/node/node-cjs/index.js",
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
