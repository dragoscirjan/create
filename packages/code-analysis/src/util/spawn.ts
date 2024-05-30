import {spawn as coreSpawn, SpawnOptions} from '@templ-project/core/child-process';
import {WritableStreamBuffer} from 'stream-buffers';
import {Stream} from 'stream';
import {ChildProcess} from 'child_process';
import {join as pathJoin} from 'path';

import {ToolDescription} from '../options';
import {detectModulePath} from './module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ora: any;
const createSpinner = async (message: string) => {
  if (!ora) {
    ora = (await import('ora')).default;
  }
  return ora(message).start();
};

const enhanceCommand = (command: string, modulePath: string): string[] => {
  let binary = command.split(' ').shift();
  if (!binary) {
    throw new Error(`Invalid command '${command}'; could not extract binary`);
  }

  binary = pathJoin(modulePath, '..', '.bin', binary);

  return [binary, ...command.split(' ').slice(1)];
};

// eslint-disable-next-line max-lines-per-function
export const spawnTool = async (tool: ToolDescription, options?: SpawnOptions<string>): Promise<string> => {
  for (const command of Array.isArray(tool.command) ? tool.command : [tool.command!]) {
    const spinner = await createSpinner(command);
    let modulePath = '';
    let enrichedCommand: string[] = [];

    try {
      modulePath = await detectModulePath(tool.module, [options?.cwd ?? process.cwd()]);
    } catch (err) {
      spinner.fail('Error');
      return Promise.reject(new Error(`Unable to find module '${tool.module}': ${err.message}`, {cause: err}));
    }

    try {
      enrichedCommand = enhanceCommand(command, modulePath);
    } catch (err) {
      spinner.fail('Error');
      return Promise.reject(
        new Error(`Unable to detect binary command for module '${tool.module}': ${err.message}`, {cause: err}),
      );
    }

    const stderrBuffer = new WritableStreamBuffer();
    const stdoutBuffer = new WritableStreamBuffer();

    options = {
      ...options,
      stdio: ['inherit', 'pipe', 'pipe'],
      handler: (
        proc: ChildProcess,
        resolve: (value: string | PromiseLike<string>) => void,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reject: (reason?: any) => void,
      ) => {
        proc.stdout?.pipe(stdoutBuffer);
        proc.stderr?.pipe(stderrBuffer);
        proc.on('close', (code: number) => {
          if (code !== 0) {
            spinner.fail(command);
            let buffer = stdoutBuffer.getContents();
            buffer && process.stdout.write(buffer);
            buffer = stderrBuffer.getContents();
            buffer && process.stderr.write(buffer);
            reject(new Error(`Command '${command}' failed with code ${code}`));
          }
          resolve('');
        });
      },
    };

    try {
      await coreSpawn<string>(enrichedCommand, {
        ...options,
      }).then(() => spinner.succeed(command));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  return '';
};
