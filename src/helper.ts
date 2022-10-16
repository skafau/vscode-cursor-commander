export function getObjectKeyByValue<T>(object: { [key: string]: T }, searchValue: T): string {
  const result = Object.entries(object).find(([, value]) => value === searchValue);
  return result?.[0] || '';
}

export function escapeRegExPattern(pattern: string): string {
  // Copied from https://stackoverflow.com/a/6969486/1273551
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escaped;
}
