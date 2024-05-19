import {Command} from 'commander';


const program = new Command();

program
  .command('build')
  .description('Build the project')
  .option('--target <target>', `Module's target: `, 'node-cjs')
  .option('--out-dir <outDir>', 'Folder to compile to:', './dist')
  .action(async (options, command) => {
    
  });

export default program;
