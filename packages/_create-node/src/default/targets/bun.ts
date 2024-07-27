import { CreateCommandOptions } from "../../types.js";
import { update as updatePackageJson } from "../create/package-json.js";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.info("updating package.json for bun build...");

  return updatePackageJson(options, (object) => ({
    ...object,
    exports: {
      ...object.exports,
      ".": {
        ...object.exports?.["."],
        bun: "./dist/browser/index.js",
      },
    },
  }));
}
