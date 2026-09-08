const objectiveCodes = ["revenue", "time", "care", "scale"] as const;
export type AuditObjective = typeof objectiveCodes[number];

// Older audits stored one string. Keep it readable while new answers use arrays.
export function getAuditObjectives(value: unknown): AuditObjective[] {
  const selected = Array.isArray(value) ? value : [value];
  return objectiveCodes.filter(code => selected.includes(code));
}

export function toggleAuditObjective(value: unknown, code: string): AuditObjective[] {
  const selected = getAuditObjectives(value);
  return getAuditObjectives(selected.some(item => item === code)
    ? selected.filter(item => item !== code)
    : [...selected, code]);
}

export function describeAuditObjectives(value: unknown, options: { value: string; label: string }[] = []) {
  return getAuditObjectives(value).map(code => ({ code, label: options.find(option => option.value === code)?.label || code }));
}
