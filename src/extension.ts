import {
  ExtensionContext,
  languages,
  workspace,
} from 'vscode';
import provider from './lessProvider';
import { fileStore } from './utils/store';
import { log } from './utils/log';
import { readAllLessFiles } from './lessAnalysis';

export function activate(context: ExtensionContext) {
  log('active!');
  readAllLessFiles();
  const disposable = languages.registerCompletionItemProvider({
    scheme: 'file',
    language: 'less',
  }, provider);

  context.subscriptions.push(disposable);
}

export function deactivate() {
  log('deactivate.');
  fileStore.clear();
}
