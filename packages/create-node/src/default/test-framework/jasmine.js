import writeFile from "../../util/write-file.js";

import { update as updatePackageJson } from "../../default/package-json.js";

export const jasmineConfig = (language) => ({
  spec_dir: ["."],
  spec_files: [`src/**/*.spec.${language}`, `test/**/*.test.${language}`],
  helpers: [".jasmine/*.js"],
  stopSpecOnExpectationFailure: false,
  random: false,
});

export default async function (options, config = null) {
  const { language, logger, testFramework } = options;
  logger.verbose(`configuring ${testFramework}...`);

  await writeFile(".jasmine.json", JSON.stringify(config || jasmineConfig(language), null, 2), options);

  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      test: "cross-env NODE_ENV=test BUILD_ENV=node-cjs nyc jasmine --config=.jasmine.json",
      "test:watch": 'nodemon --exec "npm run test" --watch src --watch test --ext js',
    },
  }));
}
