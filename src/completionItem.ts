import { CompletionItem, CompletionItemKind } from 'vscode';

import { fileStore } from './utils/store';
import { log } from './utils/log';

/**
 * @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/At-rule
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
];

class LessCompletions {
  collect(filePath: string) {
    const roots = [...fileStore.entries()];
    const items = roots.reduce((res, [file, root]) => {
      if (file === filePath) {
        return res;
      }
      const items = root.nodes.reduce((items: any[], node: any) => {
        if (node.type === 'atrule' && !primitiveAtRules.includes(node.name)) {
          let label = node.name;
          if (label.slice(-1) === ':') {
            label = label.slice(0, -1);
          }
          const item = new CompletionItem(`@${label}`, CompletionItemKind.Variable);
          item.detail = file;
          item.insertText = label;
          item.filterText = `@${label}`;
          item.documentation = node.params;
          items.push(item);
        }
        return items;
      }, [] as CompletionItem[]);
      res.push(...items);
      return res;
    }, [] as CompletionItem[]);
    return items;
  }
}

export const lessCompletion = new LessCompletions();
