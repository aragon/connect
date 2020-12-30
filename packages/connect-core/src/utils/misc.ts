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

const warned = new Map<string, boolean>()

export function warn(messages: any | any[], once: boolean = true) {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  if (!Array.isArray(messages)) {
    messages = [messages]
  }
  if (!once) {
    console.warn(...messages)
    return
  }
  const key = JSON.stringify(messages)
  if (!warned.has(key)) {
    console.warn(...messages)
    warned.set(key, true)
  }
}
