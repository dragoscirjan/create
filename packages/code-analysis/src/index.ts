import {Command} from 'commander';

const program = new Command();

program
  .description('Run Code Analysis on the Code')
  .option('--init', 'Initialize Code Analysis Cnfig')
  .option('--lint-staged', 'Perform Code Quality Using `lint-staged`')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  .action(async (options: any, command: any) => {});

export default program;
