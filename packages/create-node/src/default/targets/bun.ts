import { CreateCommandOptions } from "../../types";
import { update as updatePackageJson } from "../create/package-json";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.info("updating package.json for bun build...");

  return updatePackageJson(options, (object) => ({
    ...object,
    exports: {
      ...(object.exports || {}),
      ".": {
        ...(object.exports?.["."] || {}),
        bun: "./dist/browser/index.js",
      },
    },
    scripts: {
      ...object.scripts,
      "build:node-esm":
        object.scripts?.["build:node-esm"]?.replace(
          /\s?&& node .scripts\/esm-module.js/gi,
          ""
        ) + " && node .scripts/esm-module.js",
    },
  }));
}
