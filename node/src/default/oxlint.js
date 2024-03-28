import { appendRunS, update as updatePackageJson } from "../default/package-json.js";

export default async function (options) {
  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      ca: appendRunS(object?.scripts?.ca, "ca:lint"),
      "ca:lint": appendRunS(object?.scripts?.["ca:lint"], "lint"),
      lint: "run-s lint:*",
      "lint:oxlint": "oxlint",
    },
  }));
}
