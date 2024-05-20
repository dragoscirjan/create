import {readFile as nodeReadFile} from 'fs/promises';
import {join as joinPath} from 'path';
import {GenericOptions} from '../options';

// eslint-disable-next-line consistent-return
export const readFile = async <T extends GenericOptions>(file: string, options: T): Promise<string> => {
  const {projectPath, logger} = options;
  const filePath = joinPath(projectPath!, file);

  logger?.debug(`reading ${filePath}...`);
  try {
    return await nodeReadFile(filePath).then((buffer) => buffer.toString('utf-8'));
  } catch (e) {
    throw new Error(`Unable to read ${filePath}`, {cause: e});
  }
};
