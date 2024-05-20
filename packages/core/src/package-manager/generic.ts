import {mkdir, stat, writeFile as nodeWriteFile} from 'fs/promises';
import {join as joinPath} from 'path';

import {spawn, which} from '../child-process';
import {writeFile} from '../fs';
import {confirm} from '../inquire';
import {GenericOptions} from '../options';

const createMockPackageJson = async <T extends GenericOptions>(options: T): Promise<void> =>
  process.env.SKIP_NPM_INIT
    ? writeFile(
        joinPath(options.projectPath!, 'package.json'),
        JSON.stringify({
          devDependencies: {},
          scripts: {},
        }),
        options,
      )
    : undefined;

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export type PackageManagerInitOptions = GenericOptions & {
  packageManager: PackageManager;
};

export type PackageManagerInstallOptions = GenericOptions & {
  save?: boolean;
  saveDev?: boolean;
  savePeer?: boolean;
  force?: boolean;
};

export async function init<T extends PackageManagerInitOptions>(options: T): Promise<void> {
  const {projectPath, logger} = options;

  await nodeWriteFile(joinPath(options.projectPath!, 'package.json'), '{}');

  try {
    const stats = await stat(joinPath(projectPath!, 'package.json'));
    if (stats.isFile()) {
      logger?.warn('Project folder already exists.');
      await confirm();
    }
  } catch (e) {
    // not going to throw
  }

  logger?.verbose(`creating ${projectPath}...`);
  await mkdir(projectPath!, {recursive: true});
  await createMockPackageJson(options);

  const {packageManager} = options;
  const binary = await which(packageManager);
  await spawn<void>([binary, 'init'], {cwd: projectPath});
}
