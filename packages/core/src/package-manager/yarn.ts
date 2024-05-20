import {init as genericInit, PackageManagerInitOptions, PackageManagerInstallOptions} from './generic';
import {spawn, whichYarn} from '../child-process';

export async function init<T extends PackageManagerInitOptions>(options: Omit<T, 'packageManager'>) {
  return genericInit({...options, packageManager: 'yarn'});
}

export async function install<T extends PackageManagerInstallOptions>(packages: string[], options: T): Promise<void> {
  const {force, projectPath, save, saveDev = true} = options;
  const binary = await whichYarn();
  const args = [binary, 'add'];

  if (!save && saveDev) {
    args.push('-D');
  }

  args.push(...packages);

  if (force) {
    // TODO: haven't decided how to handle this yet
  }

  return spawn<void>(args, {cwd: projectPath});
}
