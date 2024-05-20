import {join as joinPath} from 'path';
import winston from 'winston';

import {init, PackageManager} from '../../src/package-manager/generic';
import * as fs from '../../src/fs';
import * as spawn from '../../src/child-process';
import * as inquire from '../../src/inquire';
import {GenericOptions} from '../../src/options';
import {unlink} from 'fs/promises';

describe('package-manager/generic', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let confirmSpy: any;
  let spawnSpy: any;
  let whichSpy: any;
  let writeFileSpy: any;
  const options = {
    projectPath: process.platform === 'win32' ? process.env.TEMP : '/tmp',
    logger: null as unknown as winston.Logger,
    packageManager: 'npm',
  };

  beforeAll(async () => {
    confirmSpy = jest.spyOn(inquire, 'confirm').mockImplementation((message?: string) => {
      return Promise.resolve();
    });

    spawnSpy = jest.spyOn(spawn, 'spawn').mockImplementation((command: string[], options?: any) => Promise.resolve(''));

    writeFileSpy = jest.spyOn(fs, 'writeFile').mockImplementation(jest.fn());

    whichSpy = jest
      .spyOn(spawn, 'which')
      .mockImplementation((binary: string): Promise<string> => Promise.resolve(`/bin/${binary}`));

    await unlink(joinPath(options.projectPath!, 'package.json')).catch(() => {});
  });

  afterEach(async () => {
    confirmSpy.mockClear();
    spawnSpy.mockClear();
    writeFileSpy.mockClear();

    await unlink(joinPath(options.projectPath!, 'package.json')).catch(() => {});
  });

  afterAll(() => {
    confirmSpy.mockRestore();
    spawnSpy.mockRestore();
    writeFileSpy.mockRestore();
  });

  it('generic', () => {
    expect(true).toBeTruthy();
  });

  it('init on empty folder to call spawn.spawn', async () => {
    await init({...options, packageManager: 'npm'});

    expect(spawn.spawn).toHaveBeenCalled();
    expect(spawn.spawn).toHaveBeenCalledWith(['/bin/npm', 'init'], {
      cwd: options.projectPath,
    });
  });

  it('init with skip npm init options to call fs.writeFile spawn.spawn', async () => {
    process.env.SKIP_NPM_INIT = '1';

    await init({...options, packageManager: 'npm'});

    expect(fs.writeFile).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalledWith(
      joinPath(options.projectPath!, 'package.json'),
      JSON.stringify({
        devDependencies: {},
        scripts: {},
      }),
      options,
    );

    expect(spawn.spawn).toHaveBeenCalled();
    expect(spawn.spawn).toHaveBeenCalledWith(['/bin/npm', 'init'], {
      cwd: options.projectPath,
    });
  });

  it('init to non empty folder to call inquire.confirm fs.writeFile spawn.spawn', async () => {
    process.env.SKIP_NPM_INIT = '1';

    await init({...options, packageManager: 'npm'});

    expect(inquire.confirm).toHaveBeenCalled();

    expect(fs.writeFile).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalledWith(
      joinPath(options.projectPath!, 'package.json'),
      JSON.stringify({
        devDependencies: {},
        scripts: {},
      }),
      options,
    );

    expect(spawn.spawn).toHaveBeenCalled();
    expect(spawn.spawn).toHaveBeenCalledWith(['/bin/npm', 'init'], {
      cwd: options.projectPath,
    });
  });
});
