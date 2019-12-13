import * as fs from 'fs';
import { parser } from './parser';
import { error } from './log';

class FileStore {
  private _store = new Map();

  get size() {
    return this._store.size;
  }

  async set(file: string) {
    if (!fs.existsSync(file)) {
      error(`${file} is not exist.`);
      return;
    }
    const root = await parser(file);
    if (root) {
      this._store.set(file, root);
    }
  }

  get(file: string) {
    return this._store.get(file);
  }

  has(file: string) {
    return this._store.has(file);
  }

  delete(file: string) {
    this._store.delete(file);
  }

  clear() {
    this._store.clear();
  }

  entries() {
    return this._store.entries();
  }

  keys() {
    return this._store.keys();
  }

  values() {
    return this._store.values();
  }

  each(cb: (value: any, key: any, map: Map<any, any>) => void) {
    return this._store.forEach(cb);
  }
}

export const fileStore = new FileStore();
