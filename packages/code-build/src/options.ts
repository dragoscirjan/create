import {
  AvailableBundlers,
  AvailableTargets,
  AvailableTranspilers,
} from "@templ-project/core";

export type ProgramInitOptions = {
  target: AvailableTargets[];
  transpiler: AvailableTranspilers;
  bundler: AvailableBundlers;
  nativeCommands?: boolean;
};

export type ProgramOptions = {
  targets?: AvailableBundlers[];
} & ProgramInitOptions;
