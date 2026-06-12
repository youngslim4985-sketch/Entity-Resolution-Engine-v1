import { ControlThresholds, StabilityState } from "./types";
import { estimator } from "./estimator";
import { optimizer } from "./optimizer";

/**
 * Adaptive Threshold Controller
 * Orchestrates the closed-loop stability cycle.
 */
export class AdaptiveController {
  private currentThresholds: ControlThresholds = {
    confidence: 0.9,
    sensitivity: 0.8,
    riskBias: 0.5
  };

  processCycle(confidence: number, latency: number): { state: StabilityState; next: ControlThresholds } {
    const state = estimator.estimate(confidence, latency);
    const next = optimizer.optimize(state);
    
    this.currentThresholds = next;

    return {
      state,
      next
    };
  }

  getThresholds() {
    return this.currentThresholds;
  }
}

export const controller = new AdaptiveController();
