import {ConfigOptions, ToolCommand, ToolDescription} from '../options';
import Listr, {ListrContext, ListrOptions} from 'listr';

import {spawn} from './spawn';

// eslint-disable-next-line max-lines-per-function
export const runAll = async (config: ConfigOptions): Promise<void> => {
  const tasks = new Listr(
    [
      {
        title: 'Preparing commands',
        task: async (ctx: ListrContext) => {
          ctx.tools = await prepareTools(config);
          ctx.errors = [];
        },
      },
      buildTask('Format and Lint...', 'lint'),
      buildTask('Quality...', 'quality'),
      {
        title: 'Quality...',
        skip: (ctx: ListrContext) => ctx.tools.filter((task) => task.tag === 'quality').length === 0,
        task: async (ctx: ListrContext) =>
          new Listr([
            ...ctx.tools
              .filter((task) => task.tag === 'lint')
              .map((task) => ({
                ...task,
                enabled: () => true,
                task: async (ctx: ListrContext) => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000)),
                title: task.title ?? task.command,
              })),
          ]),
      },
      {
        title: 'Dependency...',
        skip: (ctx: ListrContext) => ctx.tools.filter((task) => task.tag === 'dependency').length === 0,
        task: async (ctx: ListrContext) =>
          new Listr([
            {
              title: 'Running Dependency...',
              task: async (ctx: ListrContext) => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000)),
            },
          ]),
      },
      {
        title: 'Security...',
        skip: (ctx: ListrContext) => ctx.tools.filter((task) => task.tag === 'security').length === 0,
        task: async (ctx: ListrContext) =>
          new Listr([
            {
              title: 'Running Security...',
              task: async (ctx: ListrContext) => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000)),
            },
          ]),
      },
    ],
    {collapse: false} as ListrOptions<ListrContext>,
  );

  await tasks.run();
};

export const prepareTools = async (config: ConfigOptions): Promise<ToolDescription[]> => {
  let tools: ToolDescription[] = [];

  if (config.lint && !config.useLintStaged?.enabled) {
    tools = [
      ...tools,
      ...Object.keys(config.lint)
        .map((glob) => (config?.lint?.[glob] ?? []) as ToolCommand[])
        .reduce((acc, cur) => [...acc, ...cur], [])
        .map((command) => ({command, enabled: true, tag: 'lint', title: command}) as ToolDescription),
    ];
  }

  // for (const tag of ['quality', 'dependency', 'security']) {
  //   tools = [
  //     ...tools,
  //     ...(Object.values(config?.[tag] ?? {}) as ToolDescription[])
  //       ?.filter((tool: ToolDescription) => tool.enabled)
  //       .map((tool) => ({...tool, tag})),
  //   ];
  // }

  return tools;
};

export const buildTask = (title: string, tag: string) => ({
  title,
  skip: (ctx: ListrContext) => ctx.tools.filter((task) => task.tag === tag).length === 0,
  task: async (ctx: ListrContext) =>
    new Listr([
      ...ctx.tools
        .filter((tool) => tool.tag === tag)
        .map((tool) => ({
          ...tool,
          enabled: () => true,
          task: async (ctx: ListrContext) => {
            typeof tool.command === 'function' ? await tool.command(ctx) : spawn(tool.command, {cwd: process.cwd()});
          },
          title: tool.title ?? tool.command,
        })),
    ]),
});
