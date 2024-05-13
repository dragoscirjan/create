import {update as updatePackageJson} from '@templ-project/create-node/src/default/package-json.js';
import writeFile from '@templ-project/create-node/src/util/write-file.js';

import readRepoFile from '../util/read-repo-file.js';

export default async function (options) {
  const {language, logger, buildTool} = options;
  logger.verbose(`configuring (${language}) ${buildTool}...`);

  const esbuildRunner = await readRepoFile(`../nest/static/esbuild-runner.js`);
  await writeFile('.scripts/esbuild-runner.js', esbuildRunner, options);

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      'build:code': 'cross-env BUILD_ENV=node-cjs node .scripts/esbuild-runner.js',
    },
  }));
}
