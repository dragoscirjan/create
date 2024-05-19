import {spawn as cpspawn, SpawnOptions as CPSpawnOptions, ChildProcess, StdioOptions} from 'child_process';
import {logger} from './logger';

// Type for a custom child process handler function
export type ChildProcessHandler = (
  proc: ChildProcess,
  resolve: (value: string | PromiseLike<string>) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void,
) => void;

// Extended SpawnOptions interface with conditional type for stdio and optional handler
export interface SpawnOptions<T extends void | string> extends Omit<CPSpawnOptions, 'stdio'> {
  cwd?: string;
  stdio?: T extends void ? 'inherit' : StdioOptions;
  handler?: ChildProcessHandler;
}

/**
 * Helper function to spawn a child process with the given command and options.
 * @param command - The command to run.
 * @param options - Options for spawning the process.
 * @returns The spawned ChildProcess instance.
 */
const spawnGeneric = (command: string[], options?: SpawnOptions<void | string>): ChildProcess => {
  if (command.length === 0) {
    throw new Error('The command array must contain at least one element.');
  }

  const [cmd, ...args] = command;
  return cpspawn(cmd, args, options as CPSpawnOptions);
};

/**
 * Handles the output of the child process by piping it to the parent process's stdout and stderr.
 * @param command - The command to run.
 * @param options - Options for spawning the process.
 * @returns A promise that resolves when the process completes.
 */
const spawnAndPrintOutput = async (command: string[], options?: SpawnOptions<void>): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const proc = spawnGeneric(command, {...options, stdio: 'inherit'});

    proc.on('error', (e) => {
      logger.error(`Command '${command.join(' ')}' failed.`, e);
      reject(new Error(`Command '${command.join(' ')}' failed.`, {cause: e}));
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command '${command.join(' ')}' failed with exit code ${code}`));
      }
    });
  });
};

/**
 * Captures the output of the child process and returns it as a string.
 * @param command - The command to run.
 * @param options - Options for spawning the process.
 * @returns A promise that resolves with the captured stdout output.
 */
const spawnAndReturnOutput = async (command: string[], options?: SpawnOptions<string>): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const proc = spawnGeneric(command, options);

    let stdout = '';
    let stderr = '';

    if (options?.handler) {
      options.handler(proc, resolve, reject);
    } else {
      proc.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('error', (e) => {
        logger.error(`Command '${command.join(' ')}' failed.`, e);
        reject(new Error(`Command '${command.join(' ')}' failed.`, {cause: e}));
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`Command '${command.join(' ')}' failed with exit code ${code}: ${stderr}`));
        }
      });
    }
  });
};

/**
 * Main function to spawn a child process based on the provided options.
 * @param command - The command to run.
 * @param options - Options for spawning the process.
 * @returns A promise that resolves with the output or void based on the stdio option.
 */
export const spawn = <T extends void | string>(command: string[], options?: SpawnOptions<T>): Promise<T> => {
  logger.debug(`executing '${command.join(' ')}' with options '${JSON.stringify(options)}'`);

  if (options?.stdio === 'inherit') {
    return spawnAndPrintOutput(command, options as SpawnOptions<void>) as Promise<T>;
  }
  return spawnAndReturnOutput(command, {
    stdio: 'pipe',
    ...options,
  }) as Promise<T>;
};
