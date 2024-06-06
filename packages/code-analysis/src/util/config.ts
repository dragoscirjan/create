import {cosmiconfig} from 'cosmiconfig';
import {ConfigOptions} from '../options';
import merge from 'lodash.merge';

export const defaultOptions: ConfigOptions = {
  useLintStaged: {
    command: 'lint-staged',
    enabled: false,
  },
  lint: {
    // 'src/**/*.js': ['prettier --write', 'eslint --fix', 'oxlint'],
    'src/**/*.ts': ['prettier --write', 'eslint --color --fix', 'oxlint'],
    // 'src/**/*.md': ['prettier --write'],
  },
  security: {
    audit: {
      command: 'npm audit',
      enabled: false,
    },
    snyk: {
      command: 'snyk --severity-threshold=high',
      enabled: false,
    },
  },
  quality: {
    depcruise: {
      command: 'depcruise --config .dependency-cruiser.js src',
      enabled: false,
    },
    jscpd: {
      command: 'jscpd ./src --blame',
      enabled: false,
    },
    sonar: {
      command: 'sonar-scanner',
      enabled: false,
    },
  },
  dependency: {
    depcheck: {
      enabled: false,
      command: 'depcheck',
    },
    license: {
      enabled: false,
      command: 'npx license-checker --production --start .',
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
