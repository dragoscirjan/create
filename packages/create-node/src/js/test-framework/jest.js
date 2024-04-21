import jest, { jestConfig } from "../../default/jest.js";

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  const { language } = options;

  return jest(options, {
    ...jestConfig(language),
    transform: { "^.+\\.js$": "babel-jest" },
  });
}
