import writeFile from "../util/write-file.js";

import { update as updatePackageJson } from "../default/package-json.js";

export const vitestConfig = {
  test: {
    include: ["test/**/*.test.js"],
    reporters: ["verbose"],
  },
};

export default async function (options, config = vitestConfig) {
  config = `// vitest.config.js

import {defineConfig} from "vite";

export default defineConfig(${JSON.stringify(config, null, 2)});`;

  await writeFile("vitest.config.js", config, options);

  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      test: "npm run test:watch -- --run",
      "test:watch": "cross-env NODE_ENV=test vitest",
    },
  }));
}
