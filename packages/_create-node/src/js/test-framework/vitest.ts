import vitest, { vitestConfig } from "../../default/test-framework/vitest.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  return vitest(options, {
    ...vitestConfig,
    testDir: ["src", "test"],
    testMatch: ["**/*.spec.js", "**/*.test.js"],
  });
}
