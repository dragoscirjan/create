import {cosmiconfig} from 'cosmiconfig';
import {ConfigOptions} from '../options';
import merge from 'lodash.merge';

export const defaultOptions: ConfigOptions = {
  lintStaged: {
    command: 'lint-staged',
    enabled: false,
    module: 'lint-staged',
  },
  formatAndLint: {
    // 'src/**/*.js': [prettierCommand, 'eslint --fix', 'oxlint'],
    // 'src/**/*.ts': [prettierCommand, 'eslint --fix', 'oxlint'],
    // 'src/**/*.md': [prettierCommand],
  },
  security: {
    audit: {
      command: 'npm audit',
      enabled: false,
      module: '',
    },
    snyk: {
      command: 'snyk',
      enabled: false,
      module: 'snyk',
      authToken: 'SNYK_AUTH_TOKEN',
    },
  },
  quality: {
    depcruise: {
      command: 'depcruise --config .dependency-cruiser.js src',
      enabled: false,
      module: 'dependency-cruiser',
    },
    jscpd: {
      command: 'jscpd ./src --blame',
      enabled: false,
      module: 'jscpd',
    },
    sonar: {
      command: 'sonarqube-scan',
      enabled: false,
      module: 'sonar...',
      host: 'SONARQUBE_HOST',
      projectKey: 'SONARQUBE_PROJECT_KEY',
      authToken: 'SONARQUBE_AUTH_TOKEN',
    },
  },
  dependency: {
    depcheck: {
      enabled: false,
      module: 'depcheck',
      command: 'depcheck',
    },
    licenseCheck: {
      enabled: false,
      module: 'license-checker',
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

export const normalizeConfigOptions = (config: ConfigOptions): ConfigOptions => merge(defaultOptions, config);

export const loadConfig = async (configPath?: string): Promise<ConfigOptions> => {
  const explorer = cosmiconfig('code-analysis');
  return await (configPath ? explorer.load(configPath) : explorer.search()).then((result) =>
    normalizeConfigOptions(result?.config ?? defaultOptions),
  );
};
