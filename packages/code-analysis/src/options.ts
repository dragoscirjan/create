import {InitOpts as LicenseCheckerOptions} from 'license-checker';

// https://www.npmjs.com/package/eslint
// https://www.npmjs.com/package/oxlint
// https://www.npmjs.com/package/prettier
// https://www.npmjs.com/package/standard
export interface FormatAndLintOptions {
  [key: string]: string | string[];
}

export type ToolDescription = {
  enabled?: boolean;
  module: string;
  command?: string | string[];
};

export type SecurityOptions = {
  audit?: ToolDescription; // https://www.npmjs.com/package/npm-audit
  retire?: ToolDescription; // https://www.npmjs.com/package/retire
  // https://www.npmjs.com/package/snyk
  snyk?: ToolDescription & {
    authToken: string;
  };
};

export type QualityOptions = {
  jscpd?: ToolDescription; // https://www.npmjs.com/package/jscpd
  depcruise?: ToolDescription; // https://www.npmjs.com/package/dependecy-cruiser
  // https://www.npmjs.com/package/sonarqube-scanner
  sonar?: ToolDescription & {
    host: string;
    projectKey: string;
    authToken: string;
  };
  // https://www.npmjs.com/package/upjs-plato
  // plato?: ToolDescription;
};

export type DependencyOptions = {
  depcheck?: ToolDescription; // https://www.npmjs.com/package/depcheck
  // https://www.npmjs.com/package/license-checker
  licenseCheck?: Omit<ToolDescription, 'command'> & {
    options: LicenseCheckerOptions;
  };
};

export type ConfigOptions = {
  lintStaged?: ToolDescription; // https://www.npmjs.com/package/lint-staged
  formatAndLint?: FormatAndLintOptions;
  security?: SecurityOptions;
  quality?: QualityOptions;
  dependency?: DependencyOptions;
};
