import {
  commands,
  Disposable,
  ExtensionContext,
  languages,
  Uri,
  window,
  workspace,
} from 'vscode';
import provider from './lessProvider';
import { fileStore } from './utils/store';
import { log } from './utils/log';
import { readAllLessFiles } from './lessAnalysis';
import { clearRCConfig, load, search, ILessHelperRCConfig } from './config';

async function tipGlob(conf: null | Partial<ILessHelperRCConfig>, uri: Uri) {
  let msg = '';
  if (conf?.glob) {
    const { glob } = conf;
    const { fsPath } = uri;
    // 相对路径 ./src/**/*.less
    if (glob.startsWith('.')) {
      msg = `[${fsPath}] "glob" 配置 "${glob}", 不建议用以 "." 开始的相对路径 glob, 建议使用 "**/" 开头`
    }
    // 绝对路径 __dirname/src/**/*.less
    else if (glob.startsWith('/')) {
      msg = `[${fsPath}] "glob" 配置 "${glob}", 不建议用绝对路径的 glob`
    }
    else if (!glob.startsWith('**')) {
      msg = `[${fsPath}] "glob" 配置 "${glob}", 建议改为 "**/${glob}"`
    }
  }
  if (!msg) {
    return;
  }
  const actionFix = '去修改';
  const value = await window.showInformationMessage(msg, actionFix);

  if (value === actionFix) {
    commands.executeCommand('vscode.openFolder', uri);
  }
}

/**
 * 监听 .lesshelperrc 等rc配置文件
 * @param disposables
 */
function watchRCFile(disposables: Disposable[]) {
  workspace.findFiles('**/.lesshelperrc*', '**/node_modules/**', 1)
    .then((files) => {
      if (files[0]?.fsPath) {
        const conf = load(files[0].fsPath, true);
        tipGlob(conf, files[0]);
      }
    });
  const fileWatcher = workspace.createFileSystemWatcher('**/.lesshelperrc*');
  fileWatcher.onDidCreate((uri) => {
    load(uri.fsPath, true);
  });
  fileWatcher.onDidChange((uri) => {
    const conf = load(uri.fsPath, true);
    tipGlob(conf, uri);
    readAllLessFiles(disposables);
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
  watchRCFile([disposable]);
  readAllLessFiles([disposable]);
}

export function deactivate(): void {
  log('deactivate.');
  fileStore.clear();
}
