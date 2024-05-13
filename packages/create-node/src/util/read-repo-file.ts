import {readFile} from 'fs/promises';
import {join as pathJoin} from 'path';

import {GenericCommandOptions} from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function <T extends GenericCommandOptions>(file: string, _options: T): Promise<string> {
  const filePath = pathJoin(__dirname, file);
  try {
    return await readFile(filePath).then((buffer) => buffer.toString('utf-8'));
  } catch (e) {
    throw new Error(`Unable to write ${filePath}`, {cause: e});
  }
}
