import eslint, { eslintConfig } from "../../default/quality-tools/eslint.js";

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  const { logger } = options;
  logger.info("updating package.json for (babel) eslint tool...");

  return eslint(options, {
    ...eslintConfig,
  });
}
