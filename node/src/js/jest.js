import jest, { jestConfig } from "../default/jest.js";

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  return jest(options, {
    ...jestConfig,
    transform: { "^.+\\.js$": "babel-jest" },
  });
}
