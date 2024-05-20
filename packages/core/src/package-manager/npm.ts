import {init as genericInit, PackageManagerInitOptions, PackageManagerInstallOptions} from './generic';
import {spawn, whichNpm} from '../child-process';

export async function init<T extends PackageManagerInitOptions>(options: Omit<T, 'packageManager'>): Promise<void> {
  return genericInit({...options, packageManager: 'npm'});
}

export async function install<T extends PackageManagerInstallOptions>(packages: string[], options: T): Promise<void> {
  const {force, projectPath, save, saveDev = true} = options;
  const binary = await whichNpm();
  const args = [binary, 'i'];

  if (save) {
    args.push('-S');
  } else {
    if (saveDev) {
      args.push('-D');
    }
  }

  // savePeer is not supported by npm

  args.push(...packages);

  if (force) {
    // args.push("--force");
    args.push('--legacy-peer-deps');
  }

  return spawn<void>(args, {cwd: projectPath});
}
