/**
 * Get a value from a nested object using dot-notation path.
 * e.g. getByPath(obj, "stats.0.value") => obj.stats[0].value
 */
export function getByPath(
  obj: Record<string, unknown>,
  path: string
): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/**
 * Set a value in a nested object using dot-notation path.
 * Mutates the object in place.
 * e.g. setByPath(obj, "stats.0.value", "$3T+")
 */
export function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const keys = path.split(".");
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === null || current[key] === undefined) {
      // Auto-create: if next key is a number, create array; otherwise object
      current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}
