/**
 * Entropy Engine
 * Multi-signal information entropy measurement for AI outputs.
 */
export function calculateEntropy(text: string): number {
  const chars = text.length;
  if (chars === 0) return 0;

  const freq: Record<string, number> = {};
  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }

  let entropy = 0;
  for (const char in freq) {
    const p = freq[char] / chars;
    entropy -= p * Math.log2(p);
  }

  // Normalize for AI response complexity (simple Shannon approximation)
  return Math.min(entropy / 8, 1);
}
