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

export type Options = {
  formatAndLint?: FormatAndLintOptions;
  security?: SecurityOptions;
  quality?: QualityOptions;
  dependency?: DependencyOptions;
};

// const prettierCommand = 'prettier --write';

export const defaultOptions: Options = {
  formatAndLint: {
    // 'src/**/*.js': [prettierCommand, 'eslint --fix', 'oxlint'],
    // 'src/**/*.ts': [prettierCommand, 'eslint --fix', 'oxlint'],
    // 'src/**/*.md': [prettierCommand],
  },
  security: {
    audit: {
      enabled: false,
      command: 'npm audit',
    },
    snyk: {
      enabled: false,
      command: 'snyk',
      authToken: 'SNYK_AUTH_TOKEN',
    },
  },
  quality: {
    depcruise: {
      enabled: false,
      command: 'depcruise --config .dependency-cruiser.js src',
    },
    jscpd: {
      enabled: false,
      command: 'jscpd ./src --blame',
    },
    sonar: {
      enabled: false,
      command: 'sonarqube-scan',
      host: 'SONARQUBE_HOST',
      projectKey: 'SONARQUBE_PROJECT_KEY',
      authToken: 'SONARQUBE_AUTH_TOKEN',
    },
  },
  dependency: {
    licenseCheck: {
      enabled: false,
      options: {
        failOn: [
          'AGPL AGPL 1.0',
          'AGPL 3.0',
          'CDDL or GPLv2 with exceptions',
          'CNRI Python GPL Compatible',
          'Eclipse 1.0',
          'Eclipse 2.0',
          'GPL',
          'GPL 1.0',
          'GPL 2.0',
          'GPL 2.0 Autoconf',
          'GPL 2.0 Bison',
          'GPL 2.0 Classpath',
          'GPL 2.0 Font',
          'GPL 2.0 GCC',
          'GPL 3.0',
          'GPL 3.0 Autoconf',
          'GPL 3.0 GCC',
          'GPLv2 with XebiaLabs FLOSS License Exception',
          'LGPL',
          'LGPL 2.0',
          'LGPL 2.1',
          'LGPL 3.0',
          'Suspected Eclipse 1.0',
          'Suspected Eclipse 2.0',
        ].join('; '),
        production: true,
        start: process.cwd(),
      },
    },
  },
};
