import {update as updatePackageJson} from '@templ-project/create-node/src/default/package-json.js';
import writeFile from '@templ-project/create-node/src/util/write-file.js';

import readRepoFile from '../util/read-repo-file.js';

export default async function (options) {
  const {language, targets, logger, buildTool} = options;
  logger.verbose(`configuring (nest) ${buildTool}...`);

  const swcRunner = await readRepoFile(`../nest/static/swc-runner.js`);
  await writeFile('.scripts/swc-runner.js', swcRunner, options);

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: 'run-s clean build:*',
      'build:code': 'cross-env BUILD_ENV=node-cjs node .scripts/swc-runner.js',
    },
  }));
}
