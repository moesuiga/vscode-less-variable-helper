
import { cosmiconfigSync } from 'cosmiconfig';
import { log } from './utils/log';

export interface ILessHelperRCConfig {
  alias: Record<string, string>;
  glob: string;
  exclude: string;
  maxResults: number;
}

const explorerSync = cosmiconfigSync('lesshelper', {
  cache: false,
  ignoreEmptySearchPlaces: false,
});

let rcConfig = null as null | Partial<ILessHelperRCConfig>;

export function search(from: string, research?: boolean) {
  if (!research && rcConfig) {
    return rcConfig;
  }
  const res = explorerSync.search(from);
  if (res?.config) {
    rcConfig = res.config;
  }
  return rcConfig;
}

export function load(file: string, reload?: boolean) {
  if (!reload && rcConfig) {
    return rcConfig;
  }
  const res = explorerSync.load(file);
  // log('load => ', res?.config)
  if (res?.config) {
    rcConfig = res.config;
  }
  return rcConfig;
}

export function getRCConfig() {
  return rcConfig;
}

export function clearRCConfig() {
  rcConfig = null;
  explorerSync.clearCaches();
}
