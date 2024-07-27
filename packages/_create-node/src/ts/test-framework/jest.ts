import { jestSpecJs, jestTestTs } from "../../constants.js";
import jest, { jestConfig } from "../../default/test-framework/jest.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  const { language } = options;

  return jest(
    options,
    {
      ...jestConfig(language!),
      transform: { "^.+\\.ts$": "ts-jest" },
    },
    jestSpecJs,
    jestTestTs,
  );
}
