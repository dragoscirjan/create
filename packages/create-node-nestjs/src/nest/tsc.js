import {update as updatePackageJson} from '@templ-project/create-node/src/default/package-json.js';

/** @param options {{targets: string[],}} */
export default async function (options) {
  const {logger} = options;
  logger.verbose(`configuring tsc...`);

  await updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: 'run-s clean build:*',
      'build:code': 'tsc -p tsconfig.build.json',
    },
  }));
}
