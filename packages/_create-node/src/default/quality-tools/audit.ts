import {
  appendRunS,
  PackageJsonOptions,
  update as updatePackageJson,
} from "../create/package-json.js";
import { CreateCommandOptions } from "../../types.js";

/**
 * @param options {{
      packageManager: 'npm' | 'pnpm' | 'yarn'
    }}
 */
export default async function (options: CreateCommandOptions) {
  const { packageManager, logger } = options;
  logger?.info("updating package.json for audit tool...");

  return updatePackageJson(options, (object: PackageJsonOptions) => ({
    ...object,
    scripts: {
      ...object.scripts,
      ca: appendRunS(object?.scripts?.ca, "ca:security"),
      "ca:security": appendRunS(
        object?.scripts?.["ca:security"],
        "audit-modules",
      ),
      "audit-modules":
        packageManager === "npm"
          ? "npm audit"
          : packageManager === "pnpm"
            ? "pnpm audit"
            : packageManager === "yarn"
              ? "yarn audit --groups=dependencies"
              : 'echo "Unknown package manager for audit"',
    },
  }));
}
