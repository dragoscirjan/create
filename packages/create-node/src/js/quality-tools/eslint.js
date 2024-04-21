import eslint, { eslintConfig } from "../../default/eslint.js";

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  const { logger } = options;
  logger.info("updating package.json for (babel) eslint tool...");

  return eslint(options, {
    parser: "@babel/eslint-parser",
    parserOptions: { ecmaVersion: 2020, sourceType: "module" },
    ...eslintConfig,
  });
}
