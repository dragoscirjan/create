import prettier, {
  prettierConfig,
} from "../../default/quality-tools/prettier.js";
import { update as updatePackageJson } from "../../default/create/package-json.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;

  await prettier(options, {
    ...prettierConfig,
    overrides: [
      ...(prettierConfig?.overrides ?? []),
      {
        files: "*.js",
        options: {
          parser: "babel",
        },
      },
    ],
    parser: "typescript",
  });

  logger?.info("updating package.json for (babel) prettier tool...");

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
