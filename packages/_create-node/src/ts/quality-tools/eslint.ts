import eslint, { eslintConfig } from "../../default/quality-tools/eslint.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.info("updating package.json for (typescript) eslint tool...");

  return eslint(options, {
    ...eslintConfig,
    extends: [...(eslintConfig.extends ?? []), "plugin:import/typescript"],
    rules: {
      "@typescript-eslint/object-curly-spacing": "off",
      "@typescript-eslint/space-infix-ops": "off",
      ...eslintConfig.rules,
    },
  } as Record<string, unknown>);
}
