import {Command} from 'commander';
import logger from '../../create-node/dist/util/logger';
import {ConfigOptions} from './options';
import {loadConfig} from './util/config';
import {runAll} from './util/run-all';

const program = new Command();

export type ProgramOptions = {
  init?: boolean;
  staged?: boolean;
  config?: string;
  quiet?: boolean;
  verbose?: boolean;
};

program
  .description('Run Code Analysis on the Code')
  .option('--init', 'Initialize Code Analysis Config')
  .option('--staged', 'Perform Code Quality Using `lint-staged`')
  .option('--config [string]', 'Path to configuration file')
  .option('-q, --quiet', 'Suppress all output except for warnings and errors')
  .option('-v, --verbose', 'Increase logging level')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  .action(async (options: ProgramOptions) => {
    if (options.init) {
      return;
    }
    let config: ConfigOptions;
    try {
      config = await loadConfig(options.config);
    } catch (err) {
      logger.error(`Unable to read config file: ${err.message}`);
      process.exit(1);
    }
    try {
      await runAll(config);
    } catch (err) {
      console.log(err);
      // if (err instanceof SpawnError) {
      //   logger.error(`Unable to run code analysis: ${err.message}`);
      //   console.log(err.options.stdout);
      //   console.log(err.options.stderr);
      //   process.exit(err.options.code as number);
      // }
      // process.stdout.write(err.cause.stdout);
      process.exit(255);
    }
  });

export default program;
