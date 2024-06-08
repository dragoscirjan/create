import {ConfigOptions, ProgramOptions, ToolCommand, ToolDescription, ToolTag} from '../options.js';
import Listr, {ListrContext, ListrOptions, ListrTask} from 'listr';
import {execa, Result} from 'execa';

// eslint-disable-next-line max-lines-per-function
export const runAll = async (config: ConfigOptions, options: ProgramOptions): Promise<void> => {
  const tasks = new Listr(
    [
      {
        title: 'Preparing commands',
        task: async (ctx: ListrContext) => {
          ctx.options = options;
          ctx.config = config;
          ctx.tools = await prepareTools(ctx);
          ctx.results = {} as Record<string, Result>;
          ctx.errors = [];
        },
      },
      buildTask('Format and Lint...', 'lint'),
      buildTask('Quality...', 'quality'),
      buildTask('Dependency...', 'dependency'),
      buildTask('Security...', 'security'),
    ],
    {collapse: false, concurrent: false} as ListrOptions<ListrContext>,
  );

  await tasks.run().then((ctx: ListrContext) => {
    console.log(ctx);
  });
};

export const prepareTools = async (ctx: ListrContext): Promise<ToolDescription[]> => {
  let tools: ToolDescription[] = [];
  const {config} = ctx;

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

  for (const tag of ['quality', 'dependency', 'security'] as ToolTag[]) {
    tools = [
      ...tools,
      ...((Object.values(config?.[tag] ?? {}) as ToolDescription[])
        ?.filter((tool: ToolDescription) => tool.enabled)
        .map((tool: ToolDescription) => ({...tool, tag})) as ToolDescription[]),
    ];
  }

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
                      const [binary, ...args] = (tool.command as string).split(' ');
                      return execa(binary, args, {preferLocal: true})
                        .then((response: Result) => {
                          ctx.results[tool.title as string] = response;
                          resolve(response);
                        })
                        .catch((err) => {
                          // console.error(err);
                          reject(err);
                        });
                    });
              },
              title: tool.title ?? tool.command,
            }) as ListrTask,
        ),
      {concurrent: ctx.options.concurrent},
    ),
});
