import * as fs from 'fs';

import { error } from './log';

const postcss = require('postcss');

export async function parser(filePath: string) {
  const data = fs.readFileSync(filePath, 'utf8');
  return postcss().process(data).then((output: any) => {
    return output.root;
  }).catch((err: {
    name: string;
    reason: string;
    source: string;
    line: number;
    column: number;
    input: {
      line: number;
      column: number;
      source: string;
    }
  }) => {
    error(`${err.name} in [${filePath}] line:${err.line} column:${err.column}`);
  });
}
