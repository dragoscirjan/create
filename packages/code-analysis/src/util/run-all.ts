import {ConfigOptions, ToolCommand, ToolDescription} from '../options.js';
import Listr, {ListrContext, ListrOptions, ListrTask} from 'listr';
import {execa} from 'execa';

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
      // {
      //   title: 'Quality...',
      //   skip: (ctx: ListrContext) => ctx.tools.filter((tool: ToolDescription) =>
      //            tool.tag === 'quality').length === 0,
      //   task: async (ctx: ListrContext) =>
      //     new Listr([
      //       ...ctx.tools
      //         .filter((tool: ToolDescription) => tool.tag === 'lint')
      //         .map(
      //           (tool: ToolDescription) =>
      //             ({
      //               ...tool,
      //               enabled: () => true,
      //               task: async (ctx: ListrContext) =>
      //                 new Promise((resolve) => setTimeout(resolve, Math.random() * 1000)),
      //               title: tool.title ?? tool.command,
      //             }) as ListrTask,
      //         ),
      //     ]),
      // },
      // {
      //   title: 'Dependency...',
      //   skip: (ctx: ListrContext) =>
      //     ctx.tools.filter((tool: ToolDescription) => tool.tag === 'dependency').length === 0,
      //   task: async (ctx: ListrContext) =>
      //     new Listr([
      //       {
      //         title: 'Running Dependency...',
      //         task: async (ctx: ListrContext) => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000)),
      //       },
      //     ]),
      // },
      // {
      //   title: 'Security...',
      //   skip: (ctx: ListrContext) => ctx.tools.filter((tool: ToolDescription) =>
      //        tool.tag === 'security').length === 0,
      //   task: async (ctx: ListrContext) =>
      //     new Listr([
      //       {
      //         title: 'Running Security...',
      //         task: async (ctx: ListrContext) => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000)),
      //       },
      //     ]),
      // },
    ],
    {collapse: false} as ListrOptions<ListrContext>,
  );

  await tasks.run().then((ctx: ListrContext) => {
    console.log(ctx);
  });
};

export const prepareTools = async (config: ConfigOptions): Promise<ToolDescription[]> => {
  let tools: ToolDescription[] = [];

  if (config.lint && !config.useLintStaged?.enabled) {
    tools = [
      ...tools,
      ...Object.keys(config.lint)
        .map(
          (glob) => ((config?.lint?.[glob] ?? []) as string[]).map((command) => `${command} ${glob}`) as ToolCommand[],
        )
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
  skip: (ctx: ListrContext) => ctx.tools.filter((tool: ToolDescription) => tool.tag === tag).length === 0,
  task: async (ctx: ListrContext) =>
    new Listr(
      ctx.tools
        .filter((tool: ToolDescription) => tool.tag === tag)
        .map(
          (tool: ToolDescription) =>
            ({
              ...tool,
              enabled: () => true,
              task: async (ctx: ListrContext) => {
                return typeof tool.command === 'function'
                  ? await tool.command(ctx)
                  : new Promise((resolve, reject) => {
                      const [binary, ...args] = tool.command.split(' ');
                      return execa(binary, args, {preferLocal: true})
                        .then((response) => {
                          ctx.stdout = ctx.stdout ?? [];
                          ctx.stdout = [...ctx.stdout, tool.command as string, response.stdout];
                          resolve(response);
                          console.log(response.stdout);
                        })
                        .catch(reject);
                    });
              },
              title: tool.title ?? tool.command,
            }) as ListrTask,
        ),
    ),
});
