import { CompletionItem, CompletionItemKind, MarkdownString, workspace } from 'vscode';
import { join, dirname, relative } from 'path';
import { fileStore } from './utils/store';
import { log } from './utils/log';
import * as postcssLess from 'postcss-less';
import postcss = require('postcss');
import { search } from './config';
import { isColor } from './utils/color';

type LessChildNode = postcss.ChildNode | postcssLess.AtRule | postcssLess.Rule | postcssLess.Comment | postcssLess.Declaration;

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
  'property',
  'layer',
];

class LessCompletions {
  private getImportFiles(filePath: string) {
    if (!fileStore.has(filePath)) {
      return [];
    }
    const currentRootNode = fileStore.get(filePath);
    if (!currentRootNode?.nodes) {
      return [];
    }
    const importFiles = currentRootNode.nodes
      .reduce((files, node) => {
        if (node.type === 'atrule' && node.name === 'import' && node.params) {
          const matchArray = /(['"])([^'"]+)\1/.exec(node.params);
          if (matchArray) {
            const importFile = this.getAbsPathByAlias(filePath, matchArray[2]);

            files.push(importFile);
          }
        }
        return files;
      }, [] as string[])
      .filter((file) => !!file);

    return importFiles;
  }

  /**
   * 查找别名替换路径并设置为绝对路径
   * @param filePath
   * @param importFile
   */
  private getAbsPathByAlias(filePath: string, importFile: string) {
    const dirPath = dirname(filePath);
    const currentWorkSpaceFolder = workspace
      .workspaceFolders
      ?.find((folder) => dirPath.startsWith(folder.uri.fsPath));
    let aliases: Record<string, string> = {};

    let fsDir = dirPath;
    if (currentWorkSpaceFolder?.uri.fsPath) {
      fsDir = currentWorkSpaceFolder.uri.fsPath;
      const config = search(fsDir);
      if (config?.alias) {
        aliases = config.alias;
      }
    }
    const aliasKeys = Object.keys(aliases);
    const len = aliasKeys.length;
    let isAliasPath = false;
    for (let i = 0; i < len; i++) {
      const aliasName = aliasKeys[i];
      if (importFile.startsWith(aliasName)) {
        isAliasPath = true;
        importFile = `${aliases[aliasName]}${importFile.substr(aliasName.length)}`;
        break;
      }
    }
    return join(isAliasPath ? fsDir : dirPath, importFile);
  }

  private getLessVariable(root: postcss.Root, relativePath: string) {
    const items: CompletionItem[] = [];
    if (!root.nodes) {
      return [];
    }
    root.walk((node, index) => {
      const variableItem = this._lessVariable(node, relativePath);
      const funcItem = this._lessFunction(node, relativePath);
      if (variableItem) {
        items.push(variableItem);
      }
      if (funcItem) {
        items.push(funcItem);
      }
    })
    // log('after walk', items.length, items)

    return items;
  }

  private _lessVariable(node: LessChildNode, relativePath: string) {
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

    const isMixinAtRule = !!(node as postcssLess.MixinAtRule).mixin;
    let valueIsColor = false;
    let value = node.params;
    if (isMixinAtRule) {
      label = `${node.name}${node.params}`;
      value = label;
    } else {
      label = `@${label}`;
      valueIsColor = isColor(value)
    }

    const item = new CompletionItem(label, isMixinAtRule ? CompletionItemKind.Function : CompletionItemKind.Variable);

    if (valueIsColor) {
      item.kind = CompletionItemKind.Color;
    }
    item.detail = relativePath;
    item.insertText = `${label};`;
    item.filterText = label;
    item.preselect = true;

    item.documentation = this._jointDocAndComment(value, node as postcssLess.AtRule);

    return item;
  }

  /**
   * less class function
   *
   * like `.ellipsis(@width)`
   * @param node
   */
  private _lessFunction(node: LessChildNode, relativePath: string) {
    const funcReg = /^[\.\&]([a-zA-Z_][a-zA-Z0-9\-_]*)\s*(\(((?:\s*@[a-zA-Z0-9\-_]+\s*(?:\:\s*[^@]+)?,?)*)\))?(?:\s*when\s*(?:not\s*)?\(.+\))?(?:\:{1,2}\w+)?$/;
    // const funcValuesReg = /(@\w+)\s*(?:\:\s*([^(,]+(?:\([^)]+\))?[^,]*))?/g;

    // log(node.type, node);
    if (
      node.type !== 'rule' ||
      !node.selector ||
      !funcReg.test(node.selector)
    ) {
      return null;
    }
    // const [, label, curveParams, params] = node.selector.match(funcReg) as RegExpMatchArray;
    let [selector] = node.selector.split('when');
    // log('selector', node.selector, 'params', params);

    while (selector.startsWith('&')) {
      log('parent type => ', node.parent.type)
      selector = `${(node.parent as postcssLess.Rule).selector}${selector.slice(1)}`
    }
    const item = new CompletionItem(selector, CompletionItemKind.Function);

    let insertText = selector;
    // like `.class::before` => `.class`
    if (selector.indexOf(')') === -1 && selector.indexOf(':') > 0) {
      insertText = selector.slice(0, selector.indexOf(':'));
    }
    item.detail = relativePath;
    item.filterText = insertText;
    item.label = insertText;
    item.insertText = `${insertText};`;
    item.preselect = true;

    item.documentation = this._jointDocAndComment(node.toString(), node as postcssLess.Rule);
    return item;
  }

  /**
   * 拼接出 mixin 的完整内容
   * @param text mixin 的选择器
   * @param node mixin 的节点
   */
  private _jointDocAndComment(text: string, node: postcssLess.Rule | postcssLess.AtRule) {
    let mdStr =
      '```less\n'
      + text
      + '\n```';
    let currentNode: postcss.ChildNode = node as postcss.Rule | postcss.AtRule;
    let prevNode: void | postcss.ChildNode;
    while (prevNode = currentNode.prev()) {
      if (prevNode.type !== 'comment') {
        break;
      }

      mdStr = `${prevNode.text}\n\n${mdStr}`;
      currentNode = prevNode;
    }
    return new MarkdownString(mdStr);
  }

  collectImportFiles(filePath: string) {
    const importFiles = this.getImportFiles(filePath);
    log('importFiles', importFiles);
    const stores = [...fileStore.entries()];
    const dirPath = dirname(filePath);
    const items = stores.reduce((completionItems, [file, root]) => {
      if (importFiles.includes(file)) {
        const relativePath = relative(dirPath, file);
        completionItems.push(...this.getLessVariable(root, relativePath));
      }
      // 当前文件支持
      else if (file === filePath) {
        completionItems.push(...this.getLessVariable(root, 'CURRENT'));
      }
      return completionItems;
    }, [] as CompletionItem[]);
    return items;
  }
}

export const lessCompletion = new LessCompletions();
