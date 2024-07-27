import defaultRunner from "./default.js";

import { ProgramOptions } from "../options.js";

const runner = async (projectPath: string, options: ProgramOptions) => {
  await defaultRunner(projectPath, options);
};

export default runner;
