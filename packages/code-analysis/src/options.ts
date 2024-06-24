import {Result} from 'execa';
import {ListrContext, ListrTaskResult, ListrTaskWrapper} from 'listr';

export type ProgramOptions = {
  init?: boolean;
  staged?: boolean;
  concurrent: number;
  config?: string;
  quiet?: boolean;
  verbose?: boolean;
};

// https://www.npmjs.com/package/lint-staged
export type CAConfigOptions = {
  lint?: CAConfigLintOptions;
  useLintStaged?: CAToolOptions;
  security?: CAConfigSecurityOptions;
  dependency?: CAConfigDependencyOptions;
  quality?: CAConfigQualityOptions;
};

// https://www.npmjs.com/package/eslint
// https://www.npmjs.com/package/oxlint
// https://www.npmjs.com/package/prettier
// https://www.npmjs.com/package/standard
export interface CAConfigLintOptions {
  [glob: string]: CAToolCommand | CAToolCommand[];
}

// https://www.npmjs.com/package/npm-audit
// https://www.npmjs.com/package/retire
// https://www.npmjs.com/package/snyk
export type CAConfigSecurityOptions = Partial<Record<'audit' | 'retire' | 'snyk', CAToolOptions>>;

// https://www.npmjs.com/package/jscpd
// https://www.npmjs.com/package/dependecy-cruiser
// https://www.npmjs.com/package/sonarqube-scanner
// https://www.npmjs.com/package/upjs-plato
export type CAConfigQualityOptions = Partial<Record<'depcruise' | 'jscpd' /* | 'plato' */ | 'sonar', CAToolOptions>>;

// https://www.npmjs.com/package/depcheck
// https://www.npmjs.com/package/license-checker
export type CAConfigDependencyOptions = {
  depcheck?: CAToolOptions & {options?: CAConfigDepcheckOptions};
  license?: CAToolOptions;
};

export type CATaskDescription = {
  command: CAToolCommand;
  tag: CAConfigToolTag;
  title: string;
};

export type CAConfigDepcheckOptions = {ignoreDevDependencies?: boolean};

export type CAConfigToolTag = 'lint' | 'quality' | 'dependency' | 'security';

export type CAToolOptions = {
  command: CAToolCommand | CAToolCommand[];
  enabled?: boolean;
  options?: unknown;
  title?: string;
};

export type CAToolCommand = ShellCommand | FunctionCommand;

export type ShellCommand = string;

export type FunctionCommand = (
  ctx: ListrContext,
  task: ListrTaskWrapper<ListrContext>,
) => void | ListrTaskResult<ListrContext>;

export type CAListrContext = ListrContext & {
  options?: ProgramOptions;
  config?: CAConfigOptions;
  tasks?: CATaskDescription[];
  results?: Record<string, Result>;
  errors?: unknown[];
};
