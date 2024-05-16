import {appendRunS, PackageJsonOptions, update as updatePackageJson} from '../../default/create/package-json';
import {CreateCommandOptions} from '../../types';

export default async function (options: CreateCommandOptions) {
  const {language, logger} = options;
  logger?.info('updating package.json for oxlint tool...');

  return updatePackageJson(options, (object: PackageJsonOptions) => ({
    ...object,
    scripts: {
      ...object.scripts,
      ca: appendRunS(object?.scripts?.ca, 'ca:lint'),
      'ca:lint': appendRunS(object?.scripts?.['ca:lint'], 'lint'),
      lint: 'run-s lint:*',
      'lint:oxlint': `oxlint --jest-plugin --deny-warnings ./{src,test}/**/*.${language}`,
    },
  }));
}
