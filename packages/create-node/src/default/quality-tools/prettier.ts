import {Config} from 'prettier';

import {appendRunS, PackageJsonOptions, update as updatePackageJson} from '../../default/create/package-json';
import {CreateCommandOptions} from '../../types';
import writeFile from '../../util/write-file';

export const prettierConfig: Config = {
  bracketSpacing: false,
  overrides: [
    // see other parsers https://prettier.io/docs/en/options.html#parser
    {
      files: '*.json',
      options: {
        parser: 'json',
        singleQuote: false,
      },
    },
    {
      files: '*.json5',
      options: {
        parser: 'json5',
        singleQuote: false,
      },
    },
  ],
  parser: '?',
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};

export default async function (options: CreateCommandOptions, config = prettierConfig) {
  const {language, logger} = options;
  logger?.info('updating package.json for (generic) prettier tool...');

  const stringConfig = `// .prettierrc.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  await writeFile('.prettierrc.js', stringConfig, options);

  return updatePackageJson(options, (object: PackageJsonOptions) => ({
    ...object,
    scripts: {
      ...object.scripts,
      ca: appendRunS(object?.scripts?.ca, 'ca:lint'),
      'ca:lint': appendRunS(object?.scripts?.['ca:lint'], 'prettier'),
      prettier: `prettier ./{src,test*}/**/*.${language} --write`,
    },
  }));
}
