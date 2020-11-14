export function log(...args: any[]): void {
  console.log('[less-variable-helper]', ...args);
}

export function warn(...args: any[]): void {
  console.warn('[less-variable-helper]', ...args);
}

export function error(...args: any[]): void {
  console.error('[less-variable-helper]', ...args);
}
