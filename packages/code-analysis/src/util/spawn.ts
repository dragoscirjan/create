import {detectModuleBinaryLocations} from './module';

export class SpawnError extends Error {
  constructor(
    message,
    public options: Record<string, unknown>,
  ) {
    super(message, options);
  }
}

export const spawn = async (command: string, options: any) => {
  const {execa} = await import('execa');
  const [binary, ...binaryArgs] = command.split(' ');
  const binaryLocations = await detectModuleBinaryLocations(binary, [process.cwd()]);
  try {
    return execa(binaryLocations.shift()!, binaryArgs, options);
  } catch (err) {
    throw new SpawnError(`Command '${command}' failed with code ${err.exitCode}`, {cause: err, ...err});
  }
};
