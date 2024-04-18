import logger from '@templ-project/create-node/src/util/logger.js';
import { getModulePath } from '@templ-project/create-node/src/util/which.js';
import { join as pathJoin } from 'path';
import { run as createNodeRun } from '@templ-project/create-node/src/index.js';

/**
 * @param language {string}
 * @param runner {string}
 * @param options {{
      language: 'js' | 'ts',
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: string[],
      qualityTools: string[],
      projectPath: string
    }}
 */
export async function run(language, runner, options) {
  try {
    const { default: irun } = await import(`./nest/${runner}.js`);
    logger.info(`resolving nest/${runner} ...`);
    return irun(options);
  } catch (error) {
    logger.debug(`./nest/${runner}.js not found`);
    logger.debug(`error: ${error.message} \n ${error.stack}`);

    return createNodeRun(language, runner, options);
  }
}

