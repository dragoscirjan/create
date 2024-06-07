export type ProgramOptions = {
  init?: boolean;
  staged?: boolean;
  concurrent: number;
  config?: string;
  quiet?: boolean;
  verbose?: boolean;
};

// https://www.npmjs.com/package/lint-staged
export type ConfigOptions = {
  lint?: LintCommands;
  useLintStaged?: ToolDescription;
  security?: SecurityOptions;
  dependency?: DependencyOptions;
  quality?: QualityOptions;
};

// https://www.npmjs.com/package/eslint
// https://www.npmjs.com/package/oxlint
// https://www.npmjs.com/package/prettier
// https://www.npmjs.com/package/standard
export interface LintCommands {
  [glob: string]: ToolCommand | ToolCommand[];
}

export type ToolCommand = ShellCommand | FunctionCommand;

export type ShellCommand = string;

export type FunctionCommand = (options: unknown) => Promise<void>;

// https://www.npmjs.com/package/npm-audit
// https://www.npmjs.com/package/retire
// https://www.npmjs.com/package/snyk
export type SecurityOptions = Partial<Record<'audit' | 'retire' | 'snyk', ToolDescription>>;

// https://www.npmjs.com/package/jscpd
// https://www.npmjs.com/package/dependecy-cruiser
// https://www.npmjs.com/package/sonarqube-scanner
// https://www.npmjs.com/package/upjs-plato
export type QualityOptions = Partial<Record<'depcruise' | 'jscpd' /*| 'plato'*/ | 'sonar', ToolDescription>>;

// https://www.npmjs.com/package/depcheck
// https://www.npmjs.com/package/license-checker
export type DependencyOptions = Partial<Record<'depcheck' | 'license', ToolDescription>>;

export type ToolTag = 'lint' | 'quality' | 'dependency' | 'security';

export type ToolDescription = {
  command: ToolCommand | ToolCommand[];
  enabled?: boolean;
  options?: unknown;
  tag?: ToolTag;
  title?: string;
};
