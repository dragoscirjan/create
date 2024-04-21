import eslint, { eslintConfig } from "../../default/eslint.js";

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  const { logger } = options;
  logger.info("updating package.json for (typescript) eslint tool...");

  return eslint(options, {
    parser: "@typescript-eslint/parser",
    parserOptions: { ecmaVersion: 2020, sourceType: "module" },
    ...eslintConfig,
    extends: ["plugin:@typescript-eslint/recommended", ...eslintConfig.extends],
    plugins: ["@typescript-eslint", ...eslintConfig.plugins],
    rules: {
      "@typescript-eslint/object-curly-spacing": "off",
      "@typescript-eslint/space-infix-ops": "off",
      ...eslintConfig.rules,
    },
  });
}
