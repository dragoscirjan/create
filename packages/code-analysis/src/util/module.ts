// import path from 'path';
// import {stat} from 'fs/promises';

// /**
//  * Detects the binary path based on the given module path
//  */

// export const detectModuleBinaryLocations = async (binary: string, paths: string[]): Promise<string[]> => {
//   const npmRoot = await detectNpmRoot();
//   const locations = await detectNodeModulesLocations(paths);
//   const binaryLocations: string[] = [];

//   for (const location of locations) {
//     const binaryPath = path.join(
//       location,
//       ...(location.includes(npmRoot) ? ['..', 'bin'] : ['node_modules', '.bin']),
//       binary,
//     );
//     try {
//       const s = await stat(binaryPath);
//       if (s.isFile()) {
//         binaryLocations.push(binaryPath);
//       }
//     } catch {
//       // ignore
//     }
//   }
//   return binaryLocations;
// };

// /**
//  * Detects the possible node_modules locations based on the given paths
//  */

// let globalNodeModulesLocationsBarrier: Promise<string[]> | undefined = undefined;
// let globalNodeModulesLocations: string[];

// export const detectNodeModulesLocations = async (paths: string[] = []): Promise<string[]> => {
//   if (globalNodeModulesLocations && globalNodeModulesLocations.length) {
//     return globalNodeModulesLocations;
//   }

//   if (globalNodeModulesLocationsBarrier) {
//     return globalNodeModulesLocationsBarrier;
//   }

//   globalNodeModulesLocationsBarrier = (async () => {
//     const npmRoot = await detectNpmRoot();
//     const allPaths = [...enrichPaths(paths), npmRoot];

//     const locations = await Promise.all(allPaths.map(checkNodeModulesDirectory));
//     globalNodeModulesLocations = locations.filter(Boolean);

//     globalNodeModulesLocationsBarrier = undefined; // Clear the barrier after completion
//     return globalNodeModulesLocations;
//   })();

//   return globalNodeModulesLocationsBarrier;
// };

// const checkNodeModulesDirectory = async (p: string): Promise<string> => {
//   try {
//     const stats = await stat(path.join(p, 'node_modules'));
//     return stats.isDirectory() ? p : '';
//   } catch {
//     return '';
//   }
// };

// const enrichPaths = (paths: string[]) =>
//   paths
//     .map((p: string) => {
//       const segments = p.split(path.sep);
//       return segments
//         .map((s, j) => path.join(process.cwd().split(path.sep)[0] || path.sep, ...segments.slice(0, j + 1)))
//         .reverse();
//     })
//     .reduce((acc, cur) => [...acc, ...cur], []);

// /**
//  * Detects the global npm root directory
//  */

// let globalNpmRoot = '';
// let globalNpmRootBarrier: Promise<string> | undefined = undefined;

// export const detectNpmRoot = async (): Promise<string> => {
//   if (globalNpmRoot) {
//     return globalNpmRoot;
//   }

//   if (globalNpmRootBarrier) {
//     return globalNpmRootBarrier;
//   }

//   globalNpmRootBarrier = (async () => {
//     try {
//       const {stdout: npmRoot} = await import('execa').then(({execa}) => execa('npm', ['root', '-g']));
//       globalNpmRoot = path.dirname(npmRoot);
//       return globalNpmRoot;
//     } finally {
//       globalNpmRootBarrier = undefined; // Clear the barrier after completion
//     }
//   })();

//   return globalNpmRootBarrier;
// };
