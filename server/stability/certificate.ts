import { IntelligenceCertificate, StabilityState } from "./types";

/**
 * Certificate Generator
 * Produces audit-ready intelligence stability certificates.
 */
export function generateCertificate(state: StabilityState, clusterId: string): IntelligenceCertificate {
  const rating = state.energy < 0.1 ? 'AAA' : state.energy < 0.2 ? 'AA' : state.energy < 0.4 ? 'A' : 'B';
  
  return {
    id: `CERT-${Math.random().toString(36).substring(7).toUpperCase()}`,
    validFor: clusterId,
    energyScore: 1 - state.energy,
    complianceRating: rating,
    signatures: [
      "ENTITY_ENGINE_V1",
      "LYAPUNOV_VALIDATOR_SECURE",
      `TS-${Date.now()}`
    ]
  };
}
