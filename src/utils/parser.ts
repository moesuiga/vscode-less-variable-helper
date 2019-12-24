import * as fs from 'fs';

import { error, log } from './log';

const postcss = require('postcss');
const syntax = require('postcss-less');
const safe = require('postcss-safe-parser');

interface IAnyObject {
  [key: string]: any;
}

export interface IPostCssParseNode extends IAnyObject {
  type: string;
  /**
   * type: 'atrule'
   * rule name
   */
  name?: string;
  /**
   * type: 'atrule'
   * @rule params, like @import "path/to/file" or @keyframes animal
   */
  params?: string;

  nodes?: IPostCssParseNode[];

  /**
   * type: 'rule'
   *
   * selector
   */
  selector?: string;

  /**
   * type: 'decl'
   * CSS 属性
   */
  prop?: string;
  /**
   * type: 'decl'
   * CSS 属性值
   */
  value?: string;
}

export async function parser(filePath: string): Promise<IPostCssParseNode | void> {
  const data = fs.readFileSync(filePath, 'utf8');
  return postcss()
    .process(data, {
      syntax,
      parser: safe,
      from: filePath,
    }).then((output: any) => {
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
