import { stat } from "fs/promises";
import { join as joinPath } from "path";

import {
  appendRunS,
  PackageJsonOptions,
  update as updatePackageJson,
} from "../create/package-json.js";
import spawn from "../../util/spawn.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  const { logger, projectPath } = options;
  logger?.info("updating package.json for dependency-cruiser tool...");

  try {
    const stats = await stat(joinPath(projectPath!, ".dependency-cruiser.js"));
    if (stats.isFile()) {
      logger?.debug(".dependency-cruiser.js already exists; moving on.");
      return;
    }
  } catch (error) {
    logger?.debug(".dependency-cruiser.js doesn't exist; creating one...");
  }

  await spawn(["./node_modules/.bin/depcruise", "--init", "oneshot"], {
    cwd: options.projectPath,
    stdio: "inherit",
  });

  await updatePackageJson(options, (object: PackageJsonOptions) => ({
    ...object,
    scripts: {
      ...object.scripts,
      ca: appendRunS(object?.scripts?.ca, "ca:quality"),
      "ca:quality": appendRunS(object?.scripts?.["ca:quality"], "depcruise"),
      depcruise: "depcruise --config .dependency-cruiser.js src",
    },
  }));
}
