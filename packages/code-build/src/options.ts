import { AvailableBundlers, AvailableTranspilers } from "@templ-project/core";

export type ProgramOptions = {
  targets?: AvailableBundlers[];
  transpiler?: AvailableTranspilers;
};
