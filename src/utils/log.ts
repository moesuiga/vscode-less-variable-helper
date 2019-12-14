export function log(...args: any[]) {
  console.log('[less-variable-helper]', ...args);
}

export function warn(...args: any[]) {
  console.warn('[less-variable-helper]', ...args);
}

export function error(...args: any[]) {
  console.error('[less-variable-helper]', ...args);
}
