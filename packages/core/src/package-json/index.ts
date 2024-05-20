import {readFile} from '../fs/read-file';
import {writeFile} from '../fs/write-file';
import {GenericOptions} from '../options';

export const packageJson = 'package.json';

type Author = {
  name: string;
  email?: string;
  url?: string;
};

type Bugs = {
  url: string;
  email?: string;
};

type Repository = {
  type: string;
  url: string;
};

type Engines = {
  node?: string;
  npm?: string;
  [engineName: string]: string | undefined;
};

type Exports = {
  [key: string]: string | Record<string, string>;
};

type Workspaces = {
  packages: string[];
  nohoist?: string[];
};

export type PackageJson = {
  name: string;
  version: string;
  description?: string;
  main?: string;
  scripts?: Record<string, string>;
  repository?: Repository | string;
  keywords?: string[];
  author?: string | Author;
  license?: string;
  bugs?: Bugs | string;
  homepage?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  bundledDependencies?: string[];
  engines?: Engines;
  os?: string[];
  cpu?: string[];
  private?: boolean;
  workspaces?: string[] | Workspaces;
  exports?: Exports;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export async function readPackageJson<T extends GenericOptions>(options: T): Promise<PackageJson> {
  return readFile(packageJson, options).then((json) => JSON.parse(json) as PackageJson);
}

export async function writePackageJson<T extends GenericOptions>(options: T, object: PackageJson): Promise<void> {
  return writeFile(packageJson, object, options);
}

export async function updatePackageJson<T extends GenericOptions>(
  options: T,
  callback: PackageJson | ((object: PackageJson) => PackageJson),
): Promise<void> {
  return readPackageJson(options)
    .then(
      (object: PackageJson) =>
        ({
          ...(typeof callback === 'function'
            ? callback(object)
            : typeof callback === 'object'
              ? {
                  ...object,
                  ...callback,
                }
              : {}),
        }) as PackageJson,
    )
    .then((object) => writePackageJson(options, object));
}

export function appendRunS(command: string, script: string): string {
  return [...new Set(['run-s', ...(command || 'run-s').split(' ').slice(1), script])].join(' ');
}

export function appendRunP(command: string, script: string): string {
  return [...new Set(['run-p', ...(command || 'run-p').split(' ').slice(1), script])].join(' ');
}
