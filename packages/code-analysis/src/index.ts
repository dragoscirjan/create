import os from 'os';
import {Command} from 'commander';
import chalk from 'chalk';

import {ConfigOptions, ProgramOptions} from './options.js';
import {loadConfig} from './util/config.js';
import {runAll} from './util/run-all.js';
import {ExecaError} from 'execa';

const program = new Command();

const defaultConcurrent: number = os.cpus().length / 2;

program
  .description('Run Code Analysis on the Code')
  .option('--init', 'Initialize Code Analysis Config')
  .option('--staged', 'Perform Code Quality Using `lint-staged`')
  .option('--config [string]', 'Path to configuration file')
  .option(
    '-p, --concurrent [number]',
    `the number of tasks to run concurrently, set 1 for serial (default: ${defaultConcurrent} | 0.5 * CPU cores)`,
    `${defaultConcurrent}`,
  )
  .option('-q, --quiet', 'Suppress all output except for warnings and errors')
  .option('-v, --verbose', 'Increase logging level')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .action(async (options: ProgramOptions) => {
    if (options.init) {
      return;
    }
    let config: ConfigOptions;
    try {
      config = await loadConfig(options.config);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
    try {
      const ctx = await runAll(config, options);
      console.log(ctx);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err instanceof ExecaError) {
        console.error(chalk.red(Array.from({length: 80}, () => '-').join('')));
        console.error(chalk.red(err.shortMessage));
        console.error(chalk.red(Array.from({length: 80}, () => '-').join('')));
        console.error(err.stdout);

        process.exit(err.exitCode);
      }
      console.error(err);
    }
  });

export default program;
