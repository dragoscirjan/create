import writeFile from "../util/write-file.js";
import jest, { jestConfig } from "../default/jest.js";
import { update as updatePackageJson } from "../default/package-json.js";

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  await jest(options, {
    ...jestConfig,
    transform: { "^.+\\.(t|j)s$": "babel-jest" },
  });

  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      test: "cross-env NODE_ENV=test NO_API_DOC=1 jest --coverage --runInBand --verbose",
      "test:jest": "npm run test:jest -- --watch",
    },
  }));
}
