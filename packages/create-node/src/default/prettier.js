import writeFile from "../util/write-file.js";

import { appendRunS, update as updatePackageJson } from "../default/package-json.js";

export const prettierConfig = {
  bracketSpacing: false,
  overrides: [
    // see other parsers https://prettier.io/docs/en/options.html#parser
    {
      files: "*.json",
      options: {
        parser: "json",
        singleQuote: false,
      },
    },
    {
      files: "*.json5",
      options: {
        parser: "json5",
        singleQuote: false,
      },
    },
  ],
  parser: "?",
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
};

/**
 * @param options {{language: 'js' | 'ts' | 'coffee', testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest', }}
 * @param config {object}
 */
export default async function (options, config = prettierConfig) {
  const { language, logger } = options;
  logger.info("updating package.json for (generic) prettier tool...");

  const stringConfig = `// .prettierrc.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  await writeFile(".prettierrc.js", stringConfig, options);

  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      ca: appendRunS(object?.scripts?.ca, "ca:lint"),
      "ca:lint": appendRunS(object?.scripts?.["ca:lint"], "prettier"),
      prettier: `prettier ./{src,test*}/**/*.${language} --write`,
    },
  }));
}
