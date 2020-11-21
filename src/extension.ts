import {
  commands,
  ExtensionContext,
  languages,
  window,
  workspace,
} from 'vscode';
import provider from './lessProvider';
import { fileStore } from './utils/store';
import { log } from './utils/log';
import { readAllLessFiles } from './lessAnalysis';
import { clearRCConfig, load, search } from './config';

function watchRCFile() {
  workspace.findFiles('**/.lesshelperrc*', '**/node_modules/**', 1)
    .then((files) => {
      if (files[0]?.fsPath) {
        const [{ fsPath }] = files;
        const conf = load(fsPath, true);
        // 相对路径 ./src/**/*.less 替换成 src/**/*.less
        if (conf?.glob && conf.glob.startsWith('./')) {
          const actionFix = '去修改';
          window.showWarningMessage(
            `文件 [${fsPath}] 中 "glob": "${conf.glob}" 配置不要用以 . 开始的相对路径`,
            actionFix
          ).then(async (value) => {
            if (value === actionFix) {
              log(fsPath);
              commands.executeCommand('vscode.openFolder', files[0]);
            }
          })
          conf.glob = conf.glob.replace(/^\.\//, '');
        }
      }
    });
  const fileWatcher = workspace.createFileSystemWatcher('**/.lesshelperrc*');
  fileWatcher.onDidCreate((uri) => {
    load(uri.fsPath, true);
  });
  fileWatcher.onDidChange((uri) => {
    load(uri.fsPath, true);
  });
  fileWatcher.onDidDelete((uri) => {
    clearRCConfig();
  });
}

export function activate(context: ExtensionContext): void {
  log('active!');
  const disposable = languages.registerCompletionItemProvider({
    scheme: 'file',
    language: 'less',
  }, provider);

  if (window.activeTextEditor?.document.fileName) {
    const data = search(window.activeTextEditor.document.fileName);
    log('search => ', data);
  }

  context.subscriptions.push(disposable);
  watchRCFile();
  readAllLessFiles(context.subscriptions);
}

export function deactivate(): void {
  log('deactivate.');
  fileStore.clear();
}
