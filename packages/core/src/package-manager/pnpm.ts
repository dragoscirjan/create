import {init as genericInit, PackageManagerInitOptions, PackageManagerInstallOptions} from './generic';
import {spawn, whichPnpm} from '../child-process';

export async function init<T extends PackageManagerInitOptions>(options: Omit<T, 'packageManager'>) {
  return genericInit({...options, packageManager: 'pnpm'});
}

export async function install<T extends PackageManagerInstallOptions>(packages: string[], options: T): Promise<void> {
  const {force, projectPath, save, saveDev = true} = options;
  const binary = await whichPnpm();
  const args = [binary, 'add'];

  // Determine the type of dependency to save
  if (!save && saveDev) {
    args.push('-D');
  }

  // savePeer is not supported by pnpm

  args.push(...packages);

  if (force) {
    // args.push("--force");
    // args.push("--legacy-peer-deps");
  }

  return spawn<void>(args, {cwd: projectPath});
}
