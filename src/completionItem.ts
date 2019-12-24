import { CompletionItem, CompletionItemKind } from 'vscode';
import * as path from 'path';
import { fileStore } from './utils/store';
import { log } from './utils/log';
import { IPostCssParseNode } from './utils/parser';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
 */
const primitiveAtRules = [
  'charset',
  'import',
  'namespace',
  'media',
  'page',
  'keyframes',
  'font-face',
  'supports',
  'document',
  'counter-style',
  'viewport',
  '-ms-viewport',
  '-moz-document',
  '-moz-keyframes',
  '-o-keyframes',
  '-webkit-keyframes',
  'font-feature-values',
  'swash',
  'ornaments',
  'annotation',
  'stylistic',
  'styleset',
  'character-variant',
];

class LessCompletions {
  private getImportFiles(filePath: string) {
    if (!fileStore.has(filePath)) {
      return [];
    }
    const currentRootNode = fileStore.get(filePath)!;
    const dirPath = path.dirname(filePath);
    const importFiles = currentRootNode.nodes!
      .reduce((files, node) => {
        if (node.type === 'atrule' && node.name === 'import' && node.params) {
          const matchArray = /(['"])([^'"]+)\1/.exec(node.params);
          if (matchArray) {
            files.push(matchArray[2]);
          }
        }
        return files;
      }, [] as string[])
      .filter((file) => !!file)
      .map((file) => path.join(dirPath, file));

    return importFiles;
  }

  private getLessVariable(root: IPostCssParseNode, relativePath: string) {
    const items: CompletionItem[] = [];
    root.nodes!.forEach((node) => {
      const variableItem = this._lessVariable(node, relativePath);
      const funcItem = this._lessFunction(node, relativePath);
      if (variableItem) {
        items.push(variableItem);
      }
      if (funcItem) {
        items.push(funcItem);
      }
    });
    return items;
  }

  private _lessVariable(node: IPostCssParseNode, relativePath: string) {
    if (
      node.type !== 'atrule' ||
      !node.name ||
      primitiveAtRules.includes(node.name)
    ) {
      return null;
    }
    let label = node.name;
    if (label.slice(-1) === ':') {
      label = label.slice(0, -1);
    }
    const item = new CompletionItem(`@${label}`, CompletionItemKind.Variable);
    item.detail = relativePath;
    item.insertText = label;
    item.filterText = label;
    item.documentation = node.params;
    return item;
  }

  /**
   * less class function
   *
   * like `.ellipsis(@width)`
   * @param node
   */
  private _lessFunction(node: IPostCssParseNode, relativePath: string) {
    const funcReg = /^\.([a-zA-Z0-9\-_]+)\s*(\(((?:\s*@[a-zA-Z0-9\-_]+\s*(?:\:\s*[^@]+)?,?)*)\))?$/;
    const funcValuesReg = /(@\w+)\s*(?:\:\s*([^)@,]+))?/g;

    if (
      node.type !== 'rule' ||
      !node.selector ||
      !funcReg.test(node.selector)
    ) {
      return null;
    }
    const [, label, params] = node.selector.match(funcReg) as RegExpMatchArray;

    const item = new CompletionItem(`.${label}`, CompletionItemKind.Function);
    item.detail = relativePath;
    item.filterText = label;
    if (!params) {
      item.insertText = `${label};`;
      item.documentation = `.${label};`;
      return item;
    }

    let matches: RegExpExecArray | null;
    const args = [];
    while (matches = funcValuesReg.exec(node.selector)) {
      const [, name, value] = matches;
      args.push([name, value]);
    }

    const insertStr = args.map(([k,v]) => k).join(', ');

    const paramStr = args.map(([k,v]) => `${v ? `${k}: ${v}` : `${k}`}`).join(', ');
    item.insertText = `${label}(${insertStr});`;
    item.documentation = `.${label} (${paramStr})`;
    return item;
  }

  collectImportFiles(filePath: string) {
    const importFiles = this.getImportFiles(filePath);
    const stores = [...fileStore.entries()];
    const dirPath = path.dirname(filePath);
    const items = stores.reduce((items, [file, root]) => {
      if (importFiles.includes(file)) {
        const relativePath = path.relative(dirPath, file);
        items.push(...this.getLessVariable(root, relativePath));
      }
      return items;
    }, [] as CompletionItem[]);
    return items;
  }
}

export const lessCompletion = new LessCompletions();
