import writeFile from "../util/write-file.js";
import { update as updatePackageJson } from "./package-json.js";

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      test: "cross-env NODE_ENV=test BUILD_ENV=node-cjs nyc ava",
      "test:watch": "npm run test -- --watch",
    },
  }));
}
