import { StabilityMetric } from "./types";

/**
 * Drift Detector
 * Monitors for semantic or threshold drift in AI intelligence outputs.
 */
export class DriftDetector {
  private history: number[] = [];
  private readonly WINDOW_SIZE = 10;
  private readonly DRIFT_THRESHOLD = 0.15;

  observe(value: number): StabilityMetric {
    this.history.push(value);
    if (this.history.length > this.WINDOW_SIZE) this.history.shift();

    const avg = this.history.reduce((a, b) => a + b, 0) / this.history.length;
    const currentDrift = Math.abs(value - avg);

    let status: 'STABLE' | 'DRIFTING' | 'CRITICAL' = 'STABLE';
    if (currentDrift > this.DRIFT_THRESHOLD * 2) status = 'CRITICAL';
    else if (currentDrift > this.DRIFT_THRESHOLD) status = 'DRIFTING';

    return {
      name: "Intelligence Drift",
      value: currentDrift,
      status
    };
  }
}

export const detector = new DriftDetector();
