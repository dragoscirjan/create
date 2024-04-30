import { CreateCommandOptions } from "../../types";
import {
  PackageJsonOptions,
  update as updatePackageJson,
} from "../create/package-json";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.info("updating package.json for browser build...");

  return updatePackageJson(options, (object: PackageJsonOptions) => ({
    ...object,
    exports: {
      ...(object.exports || {}),
      ".": {
        ...(object?.exports?.["."] || {}),
        browser: "./dist/browser/index.js",
        worker: "./dist/browser/index.js",
      },
    },
  }));
}
