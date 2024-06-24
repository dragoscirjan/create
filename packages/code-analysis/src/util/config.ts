import {cosmiconfig} from 'cosmiconfig';
import {
  CAConfigDepcheckOptions,
  CAConfigLintOptions,
  CAConfigOptions,
  CAConfigToolTag,
  CATaskDescription,
  CAToolCommand,
  CAToolOptions,
} from '../options.js';
import merge from 'lodash.merge';
import {ListrContext} from 'listr';
import {normalize} from './normalize-path.js';
import {packageJson} from './package-json.js';

// eslint-disable-next-line max-lines-per-function
export const convertConfigToCaTasks = async (ctx: ListrContext): Promise<CATaskDescription[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  let tasks: CATaskDescription[] = [];
  const {config} = ctx;

  // convert lint commands to tasks
  if (config.lint && !config.useLintStaged?.enabled) {
    tasks = [
      ...tasks,
      ...Object.entries(config.lint as CAConfigLintOptions)
        .map(([glob, commands]) => [glob, Array.isArray(commands) ? commands : [commands]] as [string, string[]])
        // each glob can contain multiple commands that needs task conversion
        // and then reducing the array of arrays into a single array
        .map(([glob, commands]) => commands.map((command) => enrichCommandWithGlob(command, glob)) as string[])
        .reduce((acc, cur) => [...acc, ...cur], [])
        .map(
          (command: CAToolCommand) =>
            ({
              command,
              enabled: true,
              tag: 'lint',
              title: command,
            }) as CATaskDescription,
        ),
    ];
  }

  // convert the other options into tasks
  for (const tag of ['quality', 'dependency', 'security'] as CAConfigToolTag[]) {
    tasks = [
      ...tasks,
      ...(Object.values(config?.[tag] ?? {}) as CAToolOptions[])
        .filter((tool: CAToolOptions) => tool.enabled)
        // each tool can contain multiple tools that needs task conversion
        // and then reducing the array of arrays into a single array
        .map(({command, ...tool}: CAToolOptions) =>
          (Array.isArray(command) ? command : [command]).map((c) => ({...tool, command: c, tag}) as CATaskDescription),
        )
        .reduce((acc, cur) => [...acc, ...cur], []),
    ];
  }

  // enrich the commands with options
  for (const task of tasks) {
    task.command = await enrichCommandWithOptions(task);
  }

  return tasks;
};

const enrichCommandWithGlob = (command: string, glob: string): string => {
  if (typeof command !== 'string') {
    throw new TypeError('expected command to be a string');
  }
  return `${command} ${normalize(glob)}`;
};

const enrichCommandWithOptions = async (tool: CAToolOptions): Promise<CAToolCommand> => {
  let {command} = tool;
  const {options} = tool;

  if (typeof command !== 'string') {
    return command as CAToolCommand;
  }

  if (command.includes('depcheck') && (options as CAConfigDepcheckOptions)?.ignoreDevDependencies) {
    const packageJsonOptions = await packageJson();
    command = `${command} --ignores=${Object.keys(packageJsonOptions?.devDependencies ?? {}).join(',')}`;
  }

  if (command.includes('eslint') && !command.includes('--color')) {
    command = `${command} --color`;
  }

  return command as CAToolCommand;
};

export const loadConfig = async (configPath?: string): Promise<CAConfigOptions> => {
  const explorer = cosmiconfig('code-analysis');
  return await (configPath ? explorer.load(configPath) : explorer.search()).then((result) =>
    normalizeConfig(result?.config ?? defaultOptions),
  );
};

const normalizeConfig = (config: CAConfigOptions): CAConfigOptions => merge(defaultOptions, config);

export const defaultOptions: CAConfigOptions = {
  useLintStaged: {
    command: 'lint-staged',
    enabled: false,
  },
  lint: {
    // 'src/**/*.js': ['prettier --write', 'eslint --fix', 'oxlint'],
    // 'src/**/*.ts': ['prettier --write', 'eslint --color --fix', 'oxlint --fix'],
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
      command: 'depcruise src',
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
      command: 'depcheck .',
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
