import {
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionItemKind
} from 'vscode';

import { lessCompletion } from './completionItem';
import { log } from './utils/log';

class LessProvider implements CompletionItemProvider {
  async provideCompletionItems(textDoc: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
    const { languageId } = textDoc;
    if (!(languageId === 'less')) {
      log(`file [${textDoc.fileName}] is not less file`);
      return [];
    }

    const items = lessCompletion.collectImportFiles(textDoc.fileName);

    return items;
    // return items.concat(...store.values());
  }
}

const provider = new LessProvider();

export default provider;
