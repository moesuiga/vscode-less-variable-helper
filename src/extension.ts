import {
  ExtensionContext,
  languages,
} from 'vscode';
import provider from './lessProvider';
import { fileStore } from './utils/store';
import { log } from './utils/log';
import { readAllLessFiles } from './lessAnalysis';

export function activate(context: ExtensionContext): void {
  log('active!');
  readAllLessFiles();
  const disposable = languages.registerCompletionItemProvider({
    scheme: 'file',
    language: 'less',
  }, provider);

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  log('deactivate.');
  fileStore.clear();
}
