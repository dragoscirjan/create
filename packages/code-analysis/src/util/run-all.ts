import {
  CAConfigOptions,
  CAListrContext,
  CATaskDescription,
  CAToolCommand,
  FunctionCommand,
  ProgramOptions,
} from '../options.js';
import Listr, {ListrOptions, ListrTask} from 'listr';
import {execa, Result} from 'execa';
import {convertConfigToCaTasks} from './config.js';

// eslint-disable-next-line max-lines-per-function
export const runAll = async (config: CAConfigOptions, options: ProgramOptions): Promise<void> => {
  const tasks = new Listr(
    [
      {
        title: 'Preparing commands',
        task: async (ctx: CAListrContext) => {
          ctx.options = options;
          ctx.config = config;
          ctx.tasks = await convertConfigToCaTasks(ctx);
          ctx.results = {} as Record<string, Result>;
          ctx.errors = [];
        },
      },
      prepareTaskByTag('Format and Lint...', 'lint'),
      prepareTaskByTag('Quality...', 'quality'),
      prepareTaskByTag('Dependency...', 'dependency'),
      prepareTaskByTag('Security...', 'security'),
    ],
    {collapse: false, concurrent: false, exitOnError: true} as ListrOptions<CAListrContext>,
  );

  return tasks.run();
};

export const prepareTaskByTag = (title: string, tag: string) => ({
  skip: (ctx: CAListrContext) => ctx.tasks.filter((task: CATaskDescription) => task.tag === tag).length === 0,
  task: async (ctx: CAListrContext) => {
    // return new Promise((resolve) => setTimeout(resolve, 10000));
    const tasks = ctx.tasks.filter((task: CATaskDescription) => task.tag === tag).map(prepareSubtask);

    return new Listr(tasks, {
      concurrent: parseInt(ctx.options.concurrent),
      exitOnError: true,
    });
  },
  title,
});

export const prepareSubtask = (task: CATaskDescription): ListrTask => {
  const {title, command} = task;

  return {
    ...task,
    enabled: () => true,
    task: prepareListrTaskFromCommand(task),
    title: taskTitle(title ?? (command as string)),
  };
};

export const prepareListrTaskFromCommand = (task: CATaskDescription) => async (ctx: CAListrContext) => {
  const {command, title} = task;

  // return new Promise((resolve) =>
  //   setTimeout(() => {
  //     ctx.results[title as string] = command;
  //     resolve(command);
  //   }, 10000),
  // );

  return typeof command === 'function'
    ? (command as FunctionCommand)
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Promise<any>((resolve, reject) => {
      const [binary, ...args] = (command as string).split(' ');
      return execa(binary, args, {preferLocal: true})
        .then((response: Result) => {
          ctx.results[title as string] = response;
          resolve(response);
        })
        .catch((err) => {
          ctx.errors.push(err);
          reject(err);
        });
    });
};

const taskTitle = (command: CAToolCommand): string => {
  if (typeof command !== 'string') {
    return 'no title';
  }
  return command.length > 30 ? `${command.substring(0, 30)}...` : command;
};
