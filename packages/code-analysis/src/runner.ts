import {ConfigOptions} from './options';
import {spawnTool} from './util/spawn';
import {InitOpts as LicenseCheckerOptions} from 'license-checker';

export const runner = async (config: ConfigOptions): Promise<void> => {
  await runFormatAndLint(config);
  await runSecurity(config);
  await runQuality(config);
  await runDependency(config);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const runFormatAndLint = async (config: ConfigOptions): Promise<void> => {
  console.log('TODO: runFormatAndLint');
};

const runSecurity = async (options: ConfigOptions): Promise<void> => {
  if (options?.security?.audit?.enabled) {
    await spawnTool(options?.security?.audit, {
      cwd: process.cwd(),
    });
  }
  // if (options.security.retire) {
  //   await runTool(options.security.retire);
  // }
  // if (options.security.snyk) {
  //   await runTool(options.security.snyk);
  // }
};

const runQuality = async (options: ConfigOptions): Promise<void> => {
  if (options?.quality?.depcruise?.enabled) {
    await spawnTool(options?.quality?.depcruise, {
      cwd: process.cwd(),
    });
  }
  if (options?.quality?.jscpd?.enabled) {
    await spawnTool(options?.quality?.jscpd, {
      cwd: process.cwd(),
    });
  }
  if (options?.quality?.sonar?.enabled) {
    await spawnTool(options?.quality?.sonar, {
      cwd: process.cwd(),
    });
  }
};

const runDependency = async (options: ConfigOptions): Promise<void> => {
  console.log('TODO: runDependency');
  if (options?.dependency?.depcheck?.enabled) {
    await spawnTool(options?.dependency?.depcheck, {
      cwd: process.cwd(),
    });
  }
  if (options?.dependency?.licenseCheck?.enabled) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    runLicenseCheck(options?.dependency?.licenseCheck?.options!);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const runLicenseCheck = async (options: LicenseCheckerOptions): Promise<void> => {
  console.log('TODO: runLicenseCheck');
};
