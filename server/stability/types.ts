export interface StabilityState {
  energy: number; // Lyapunov energy: V(x)
  drift: number;  // Delta in intelligence quality
  entropy: number; // Multi-signal information entropy
  timestamp: string;
}

export interface ControlThresholds {
  confidence: number;
  sensitivity: number;
  riskBias: number;
}

export interface StabilityMetric {
  name: string;
  value: number;
  status: 'STABLE' | 'DRIFTING' | 'CRITICAL';
}

export interface IntelligenceCertificate {
  id: string;
  validFor: string;
  energyScore: number;
  complianceRating: 'AAA' | 'AA' | 'A' | 'B';
  signatures: string[];
}
