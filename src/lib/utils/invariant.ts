export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[VinSOC] Invariant failed: ${message}`);
  }
}
