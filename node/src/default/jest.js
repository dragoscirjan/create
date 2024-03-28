import writeFile from "../util/write-file.js";

export const jestConfig = {
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "json", "jsx"],
  roots: ["test"],
  testEnvironment: "node",
  testMatch: ["**/{src,test}/**/*.{spec,test}.jsx?"],
};

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options, config = jestConfig) {
  const stringConfig = `// .commitlintrc.js

module.extends = ${JSON.stringify(config, null, 2)};`;

  await writeFile(".jest.config.js", stringConfig, options);
}
