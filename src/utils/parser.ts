import * as fs from 'fs';
import * as postcss from 'postcss';
import * as syntax from 'postcss-less';

import { error, log } from './log';

export async function parser(filePath: string): Promise<void | postcss.Root> {
  const data = fs.readFileSync(filePath, 'utf8');
  return postcss()
    .process(data, {
      syntax: syntax as postcss.Syntax,
      parser: syntax.parse as postcss.Parser,
      from: filePath,
    }).then((output) => {
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
