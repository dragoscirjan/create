import { stat } from "fs/promises";
import { join as joinPath } from "path";

import { appendRunS, update as updatePackageJson } from "../default/package-json.js";
import spawn from "../util/spawn.js";

export default async function (options) {
  try {
    const stats = await stat(joinPath(options.projectPath, ".dependency-cruiser.js"));
    if (stats.isFile()) {
      console.log(`.dependency-cruiser.js already exists; moving on.`);
      return;
    }
  } catch (error) {}

  await spawn(["./node_modules/.bin/depcruise", "--init", "oneshot"], { cwd: options.projectPath, stdio: "inherit" });

  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      ca: appendRunS(object?.scripts?.ca, "ca:quality"),
      "ca:quality": appendRunS(object?.scripts?.["ca:quality"], "depcruise"),
      depcruise: "depcruise --config .dependency-cruiser.js src",
    },
  }));
}
