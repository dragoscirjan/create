import {init, install} from './pnpm';
import winston from 'winston';

import * as generic from './generic';
import * as spawn from '../child-process/spawn';
import * as which from '../child-process/which';

describe('pnpm', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let genericInitSpy: any;
  let spawnSpy: any;
  let whichSpy: any;
  const options = {projectPath: '/tmp', logger: null as unknown as winston.Logger};

  beforeAll(() => {
    genericInitSpy = jest
      .spyOn(generic, 'init')
      .mockImplementation((options: generic.PackageManagerInitOptions) => Promise.resolve());

    spawnSpy = jest.spyOn(spawn, 'spawn').mockImplementation((command: string[], options?: any) => Promise.resolve(''));

    whichSpy = jest
      .spyOn(which, 'which')
      .mockImplementation((binary: string): Promise<string> => Promise.resolve(`/bin/${binary}`));
  });

  afterEach(() => {
    genericInitSpy.mockClear();
    spawnSpy.mockClear();
    whichSpy.mockClear();
  });

  afterAll(() => {
    genericInitSpy.mockRestore();
    spawnSpy.mockRestore();
    whichSpy.mockRestore();
  });

  it('generic', () => {
    expect(true).toBeTruthy();
  });

  describe('init', () => {
    it('generic', () => {
      expect(true).toBeTruthy();
    });

    it('init to call generic.init', async () => {
      await init(options);

      expect(generic.init).toHaveBeenCalled();
      expect(generic.init).toHaveBeenCalledWith({
        ...options,
        packageManager: 'pnpm',
      });
    });

    it('install to call fs/spawn.spawn (saveDev)', async () => {
      await install(['axios'], options);

      expect(spawn.spawn).toHaveBeenCalled();
      expect(spawn.spawn).toHaveBeenCalledWith(['/bin/pnpm', 'add', '-D', 'axios'], {cwd: options.projectPath});
    });

    it('install to call fs/spawn.spawn (save)', async () => {
      await install(['axios'], {...options, save: true});

      expect(spawn.spawn).toHaveBeenCalled();
      expect(spawn.spawn).toHaveBeenCalledWith(['/bin/pnpm', 'add', 'axios'], {cwd: options.projectPath});
    });

    it('install to call fs/spawn.spawn (force)', async () => {
      await install(['axios'], {...options, save: true, force: true});

      expect(spawn.spawn).toHaveBeenCalled();
      expect(spawn.spawn).toHaveBeenCalledWith(['/bin/pnpm', 'add', 'axios'], {
        cwd: options.projectPath,
      });
    });
  });
});
