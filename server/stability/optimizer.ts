import { ControlThresholds, StabilityState } from "./types";

/**
 * Stability Optimizer
 * Finds optimal control parameters to minimize Lyapunov energy.
 */
export class StabilityOptimizer {
  optimize(state: StabilityState): ControlThresholds {
    // Non-linear adaptive parameter tuning
    // Adjust confidence requirement based on energy levels
    const targetConfidence = state.energy > 0.4 ? 0.95 : 0.85;
    const sensitivity = 1.0 - state.entropy * 0.5;
    const riskBias = state.drift > 0.1 ? 0.2 : 0.5;

    return {
      confidence: targetConfidence,
      sensitivity,
      riskBias
    };
  }
}

export const optimizer = new StabilityOptimizer();
