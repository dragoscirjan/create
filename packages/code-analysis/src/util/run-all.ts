import {
  ConfigOptions,
  DepcheckOptions,
  LintCommands,
  ProgramOptions,
  TaskDescription,
  ToolCommand,
  ToolDescription,
  ToolTag,
} from '../options.js';
import Listr, {ListrContext, ListrOptions, ListrTask} from 'listr';
import {execa, Result} from 'execa';
import {normalize} from './normalize-path.js';
import {packageJson} from './package-json.js';

// eslint-disable-next-line max-lines-per-function
export const runAll = async (config: ConfigOptions, options: ProgramOptions): Promise<void> => {
  const tasks = new Listr(
    [
      {
        title: 'Preparing commands',
        task: async (ctx: ListrContext) => {
          ctx.options = options;
          ctx.config = config;
          ctx.tasks = await prepareAllSubtasks(ctx);
          ctx.results = {} as Record<string, Result>;
          ctx.errors = [];
        },
      },
      prepareTaskByTag('Format and Lint...', 'lint'),
      prepareTaskByTag('Quality...', 'quality'),
      prepareTaskByTag('Dependency...', 'dependency'),
      prepareTaskByTag('Security...', 'security'),
    ],
    {collapse: false, concurrent: false, exitOnError: true} as ListrOptions<ListrContext>,
  );

  return tasks.run();
};

export const prepareAllSubtasks = async (ctx: ListrContext): Promise<TaskDescription[]> => {
  let tasks: TaskDescription[] = [];
  const {config} = ctx;

  // convert lint commands to tasks
  if (config.lint && !config.useLintStaged?.enabled) {
    tasks = [
      ...tasks,
      ...Object.entries(config.lint as LintCommands)
        .map(([glob, commands]) => [glob, Array.isArray(commands) ? commands : [commands]] as [string, string[]])
        // each glob can contain multiple commands that needs task conversion
        // and then reducing the array of arrays into a single array
        .map(([glob, commands]) => commands.map((command) => enrichCommandWithGlob(command, glob)) as string[])
        .reduce((acc, cur) => [...acc, ...cur], [])
        .map(
          (command: ToolCommand) =>
            ({
              command,
              enabled: true,
              tag: 'lint',
              title: command,
            }) as TaskDescription,
        ),
    ];
  }

  // convert the other options into tasks
  for (const tag of ['quality', 'dependency', 'security'] as ToolTag[]) {
    tasks = [
      ...tasks,
      ...(Object.values(config?.[tag] ?? {}) as ToolDescription[])
        .filter((tool: ToolDescription) => tool.enabled)
        // each tool can contain multiple tools that needs task conversion
        // and then reducing the array of arrays into a single array
        .map(({command, ...tool}: ToolDescription) =>
          (Array.isArray(command) ? command : [command]).map((c) => ({...tool, command: c, tag}) as TaskDescription),
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

const enrichCommandWithOptions = async (tool: ToolDescription): Promise<ToolCommand> => {
  let {command, options} = tool;

  if (typeof command !== 'string') {
    return command as ToolCommand;
  }

  if (command.includes('depcheck') && (options as DepcheckOptions)?.ignoreDevDependencies) {
    const packageJsonOptions = await packageJson();
    command = `${command} --ignore=${Object.keys(packageJsonOptions?.devDependencies ?? {}).join(',')}`;
  }

  if (command.includes('eslint') && !command.includes('--color')) {
    command = `${command} --color`;
  }

  return command as ToolCommand;
};

export const prepareTaskByTag = (title: string, tag: string) => ({
  skip: (ctx: ListrContext) => ctx.tasks.filter((task: TaskDescription) => task.tag === tag).length === 0,
  task: async (ctx: ListrContext) => {
    const tasks = ctx.tasks.filter((task: TaskDescription) => task.tag === tag).map(prepareSubtask);
    
    return new Listr(tasks, {
      concurrent: ctx.options.concurrent,
      // exitOnError: true,
    });
  },
  title,
});

export const prepareSubtask = (task: TaskDescription): ListrTask =>
  ({
    ...task,
    enabled: () => true,
    task: async (ctx: ListrContext) =>
      typeof task.command === 'function'
        ? task.command
        : async (ctx: ListrContext) =>
            new Promise((resolve) => {
              console.log(`Running ${task.command}`);
              const [binary, ...args] = (task.command as string).split(' ');
              return execa(binary, args, {preferLocal: true}).then((response: Result) => {
                console.log(response);
                ctx.results[task.title as string] = response;
                resolve(response);
              });
            }),
    title: taskTitle(task.title ?? (task.command as string)),
  }) as ListrTask;

const taskTitle = (command: ToolCommand): string => {
  if (typeof command !== 'string') {
    return 'no title';
  }
  return command.length > 30 ? `${command.substring(0, 30)}...` : command;
};
