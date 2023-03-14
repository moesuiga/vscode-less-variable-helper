import * as fs from 'fs';
import * as postcss from 'postcss';
import * as syntax from 'postcss-less';
import { parse as sfcParse } from '@vue/compiler-sfc';

import { error, log } from './log';

function _parseLessCode(data: string, filePath: string): Promise<void | postcss.Root> {
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

export async function parseLess(filePath: string): Promise<void | postcss.Root> {
  const data = fs.readFileSync(filePath, 'utf8');
  return _parseLessCode(data, filePath);
}

export async function parseVue(filePath: string): Promise<(void | postcss.Root)[]> {
  const data = fs.readFileSync(filePath, 'utf8');
  const result = sfcParse(data);
  const lessStyles = result.descriptor.styles.filter((style) => style.lang === 'less');
  return Promise.all(lessStyles.map(async (style) => await _parseLessCode(style.content, filePath)));
}
