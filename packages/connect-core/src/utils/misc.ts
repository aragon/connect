export function toArrayEntry<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

// Utility to normalize functions accepting optional filters,
// followed by an optional callback.
export function normalizeFiltersAndCallback<C, F>(
  filtersOrCallback?: C | F,
  callback?: C
): [F | undefined, C | undefined] {
  // Both defined
  if (callback !== undefined) {
    return [filtersOrCallback as F, callback as C]
  }

  // First param is the callback
  if (typeof filtersOrCallback === 'function') {
    return [undefined, filtersOrCallback as C]
  }

  // First param are the filters
  if (filtersOrCallback !== undefined) {
    return [filtersOrCallback as F, undefined]
  }

  // None defined
  return [undefined, undefined]
}
