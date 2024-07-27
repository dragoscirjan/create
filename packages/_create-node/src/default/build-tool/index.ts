import { BuildCommandOptions } from "../../types.js";

export const generateBuildCommand = ({
  target,
  buildTool,
}: Pick<BuildCommandOptions, "target" | "buildTool">) =>
  `create-node build --target ${target} --build-tool ${buildTool}`;
