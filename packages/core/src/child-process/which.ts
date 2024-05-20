import {spawn} from './spawn';

/**
 * Returns the absolute path to the binary file.
 * @param binary - the binary to search for
 * @returns
 */
export const which = (binary: string): Promise<string> =>
  spawn<string>([process.platform === 'win32' ? 'where' : 'which', binary]).then((b: string) => b.trim());

export const whichNode = () => which('node');
export const whichNpm = () => which('npm');
export const whichPnpm = () => which('pnpm');
export const whichYarn = () => which('yarn');
