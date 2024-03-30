import { appendRunS, update as updatePackageJson } from "../default/package-json.js";

export default async function (options) {
  const { language, logger } = options;
  logger.info("updating package.json for oxlint tool...");

  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      ca: appendRunS(object?.scripts?.ca, "ca:lint"),
      "ca:lint": appendRunS(object?.scripts?.["ca:lint"], "lint"),
      lint: "run-s lint:*",
      "lint:oxlint": `oxlint --jest-plugin --deny-warnings ./{src,test}/**/*.${language}`,
    },
  }));
}
