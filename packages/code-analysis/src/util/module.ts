import {spawn, which} from '@templ-project/core/child-process';
import path from 'path';
import {stat} from 'fs/promises';

let globalNpmRoot = '';

const detectNpmRoot = async (): Promise<string> => {
  if (globalNpmRoot) {
    return globalNpmRoot;
  }

  const npmBinary = await which('npm');
  globalNpmRoot = await spawn<string>([npmBinary, 'root', '-g'], {cwd: process.cwd()});
  globalNpmRoot = globalNpmRoot.trim();

  return globalNpmRoot;
};

export const detectModulePath = async (module: string, paths: string[]): Promise<string> => {
  const npmRoot = await detectNpmRoot();

  paths = [...paths, npmRoot];

  try {
    return require.resolve(module, {paths});
  } catch (err) {
    // ignore
  }

  try {
    return await detectModulePathWithFs(module, paths);
  } catch (err) {
    // ignore
  }

  throw new Error(`Unable to find module '${module}' in paths ${paths.join(';')}`);
};

export const detectModulePathWithFs = async (module: string, paths: string[]): Promise<string> => {
  paths = paths
    .map((p, i) => {
      if (i === paths.length - 1) {
        return [p];
      }
      const segments = p.split(path.sep);
      return segments.map((s, j) =>
        path.join(process.cwd().split(path.sep)[0] || '/', ...segments.slice(0, j + 1), 'node_modules', module),
      );
    })
    .reduce((acc, cur) => [...acc, ...cur], []);

  for (const modulePath of paths) {
    try {
      const s = await stat(modulePath);
      if (s.isDirectory()) {
        return modulePath;
      }
    } catch (err) {
      // ignore
    }
  }

  return Promise.reject(`Could not calculate path for module: '${module}'`);
};
