import { AvailableTargets } from "./options.js";

export const targetIsEsm = (targets: AvailableTargets[]) =>
  targets.length === 1 && targets.includes(AvailableTargets.Esm);
