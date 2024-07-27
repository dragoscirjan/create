import {
  AvailableBundlers,
  AvailableFormatters,
  AvailableLanguages,
  AvailableLinters,
  AvailablePackageManagers,
  AvailableQualityTools,
  AvailableTargets,
  AvailableTestFrameworks,
  AvailableTranspilers,
} from "@templ-project/core";

export type ProgramOptions = {
  language: AvailableLanguages;
  target: AvailableTargets[];
  packageManager: AvailablePackageManagers;
  testFramework: AvailableTestFrameworks;
  transpiler: AvailableTranspilers;
  bundler: AvailableBundlers;
  formatter: AvailableFormatters;
  linter: AvailableLinters;
  qualityTool: AvailableQualityTools[];
};
