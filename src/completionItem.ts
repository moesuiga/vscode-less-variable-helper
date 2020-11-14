import { CompletionItem, CompletionItemKind, workspace } from 'vscode';
import { join, dirname, relative, isAbsolute } from 'path';
import { fileStore } from './utils/store';
import { log } from './utils/log';
import { IPostCssParseNode } from './utils/parser';
import { cosmiconfigSync } from 'cosmiconfig';

const explorerSync = cosmiconfigSync('lesshelper');

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
    const currentRootNode = fileStore.get(filePath);
    if (!currentRootNode?.nodes) {
      return [];
    }
    const dirPath = dirname(filePath);
    const importFiles = currentRootNode.nodes
      .reduce((files, node) => {
        if (node.type === 'atrule' && node.name === 'import' && node.params) {
          const matchArray = /(['"])([^'"]+)\1/.exec(node.params);
          if (matchArray) {
            const importFile = this.getImportFileByAlias(filePath, matchArray[2]);

            files.push(importFile);
          }
        }
        return files;
      }, [] as string[])
      .filter((file) => !!file)
      .map((file) => {
        if (isAbsolute(file)) {
          return file;
        }
        return join(dirPath, file);
      });

    return importFiles;
  }

  /**
   * 查找别名替换路径
   * @param filePath
   * @param importFile
   */
  private getImportFileByAlias(filePath: string, importFile: string) {
    const dirPath = dirname(filePath);
    const currentWorkSpaceFolder = workspace
      .workspaceFolders
      ?.find((folder) => dirPath.startsWith(folder.uri.fsPath));
    let aliases: Record<string, string> = {};
    if (currentWorkSpaceFolder?.uri.fsPath) {
      const result = explorerSync.search(join(dirPath));
      if (result?.config) {
        aliases = result.config.alias;
      }
    }
    const aliasKeys = Object.keys(aliases);
    const len = aliasKeys.length;
    for (let i = 0; i < len; i++) {
      const aliasName = aliasKeys[i];
      if (importFile.startsWith(aliasName)) {
        importFile = `${aliases[aliasName]}${importFile.substr(aliasName.length)}`;
        break;
      }
    }
    return importFile;
  }

  private getLessVariable(root: IPostCssParseNode, relativePath: string) {
    const items: CompletionItem[] = [];
    if (!root.nodes) {
      return [];
    }
    root.nodes.forEach((node) => {
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
    item.insertText = `@${label}`;
    item.filterText = `@${label}`;
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
    const funcReg = /^\.([a-zA-Z0-9\-_]+)\s*(\(((?:\s*@[a-zA-Z0-9\-_]+\s*(?:\:\s*[^@]+)?,?)*)\))?(?:\s*when\s*(?:not\s*)?\(.+\))?$/;
    const funcValuesReg = /(@\w+)\s*(?:\:\s*([^(,]+(?:\([^)]+\))?[^,]*))?/g;

    if (
      node.type !== 'rule' ||
      !node.selector ||
      !funcReg.test(node.selector)
    ) {
      log(node.type, node.selector);
      return null;
    }
    const [, label, curveParams, params] = node.selector.match(funcReg) as RegExpMatchArray;
    log('selector', node.selector, 'params', params);

    const item = new CompletionItem(`.${label}`, CompletionItemKind.Function);
    item.detail = relativePath;
    item.filterText = `.${label}`;
    if (!params) {
      item.insertText = `.${label}${curveParams ? '()' : ''};`;
      item.documentation = `.${label}${curveParams ? '()' : ''};`;
      return item;
    }

    let matches: RegExpExecArray | null;
    const args = [];
    while (matches = funcValuesReg.exec(params)) {
      const [, name, value] = matches;
      args.push([name, value]);
    }

    const insertStr = args.map(([k]) => k).join(', ');

    const paramStr = args.map(([k,v]) => `${v ? `${k}: ${v}` : `${k}`}`).join(', ');
    item.insertText = `.${label}(${insertStr});`;
    item.documentation = `.${label} (${paramStr})`;
    return item;
  }

  collectImportFiles(filePath: string) {
    const importFiles = this.getImportFiles(filePath);
    const stores = [...fileStore.entries()];
    const dirPath = dirname(filePath);
    const items = stores.reduce((completionItems, [file, root]) => {
      if (importFiles.includes(file)) {
        const relativePath = relative(dirPath, file);
        completionItems.push(...this.getLessVariable(root, relativePath));
      }
      return completionItems;
    }, [] as CompletionItem[]);
    return items;
  }
}

export const lessCompletion = new LessCompletions();
