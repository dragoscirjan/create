import eslint, { eslintConfig } from "../../default/quality-tools/eslint";
import { CreateCommandOptions } from "../../types";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.info("updating package.json for (typescript) eslint tool...");

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
  } as any);
}
