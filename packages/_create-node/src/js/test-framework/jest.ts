import jest, { jestConfig } from "../../default/test-framework/jest.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  const { language } = options;

  return jest(options, {
    ...jestConfig(language!),
    transform: { "^.+\\.js$": "babel-jest" },
  });
}
