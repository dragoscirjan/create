import vitest, { vitestConfig } from "../default/vitest.js";

export default async function (options) {
  return vitest(options, {
    ...vitestConfig,
    testDir: ["src", "test"],
    testMatch: ["**/*.spec.js", "**/*.test.js"],
  });
}
