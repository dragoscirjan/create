import {join as pathJoin} from 'path';
import {readFile} from 'fs/promises';

export type PackageJsonOptions = {
  dependencies?: Record<string, string>;
  description?: string;
  devDependencies?: Record<string, string>;
  keywords?: string[];
  main?: string;
  name: string;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  version?: string;
  [key: string]: unknown;
};

export const packageJson = async (): Promise<PackageJsonOptions> => {
  const packageJsonBuffer = await readFile(pathJoin(process.cwd(), 'package.json'));

  return JSON.parse(packageJsonBuffer.toString());
};
