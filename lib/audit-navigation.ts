/** Accept an action only for the screen that produced it, without a timed lock. */
export function nextAuditScreen(current: number, source: number, direction: -1 | 1, last: number) {
  if (current !== source) return current;
  return Math.max(-2, Math.min(last, current + direction));
}
