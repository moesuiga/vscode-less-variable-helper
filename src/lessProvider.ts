import {
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  CompletionContext,
} from 'vscode';

import { lessCompletion } from './completionItem';
import { log } from './utils/log';

class LessProvider implements CompletionItemProvider {
  async provideCompletionItems(textDoc: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {
    const { languageId } = textDoc;
    if (!['less', 'vue'].includes(languageId)) {
      log(`file [${textDoc.fileName}] is not support type`);
      return [];
    }

    const items = lessCompletion.collectImportFiles(textDoc.fileName);

    return items;
    // return items.concat(...store.values());
  }
}

const provider = new LessProvider();

export default provider;
