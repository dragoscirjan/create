import prettier, { prettierConfig } from "../../default/prettier.js";

import { update as updatePackageJson } from "../../default/package-json.js";

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  const { logger } = options;

  await prettier(options, {
    ...prettierConfig,
    overrides: [
      ...prettierConfig.overrides,
      {
        files: "*.js",
        options: {
          parser: "babel",
        },
      },
    ],
    parser: "typescript",
  });

  logger.info("updating package.json for (babel) prettier tool...");

  await updatePackageJson(options, (object) => ({
    ...object,
    importSort: {
      ".js, .jsx": {
        parser: "babylon",
        style: "module",
      },
      ".ts, .tsx": {
        parser: "typescript",
        style: "module",
      },
    },
  }));
}
