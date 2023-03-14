import { Disposable, FileSystemWatcher, workspace } from 'vscode';
import { fileStore } from './utils/store';
import { getRCConfig } from './config';
import { log } from './utils/log';
import { isLessFile, isVueFile, getLessFileAssociations, getVueFileAssociations } from './utils/filetype';

function storeCompletionItem(filePath: string) {
  if (isLessFile(filePath)) {
    fileStore.set(filePath);
  } else if (isVueFile(filePath)) {
    fileStore.setVueStyle(filePath);
  }
}

let fileWatcher: null | FileSystemWatcher = null;

export function readAllLessFiles(disposables: Disposable[]) {
  if (fileWatcher) {
    fileWatcher.dispose();
  }
  const lessAssociations = getLessFileAssociations();
  const vueAssociations = getVueFileAssociations();
  const ext = `{${lessAssociations.join(',')},${vueAssociations.join(',')}}`;

  // .lesshelperrc 配置
  const rcConf = getRCConfig();
  // 要监视的 less 文件 glob 路径
  let glob = rcConf?.glob || `**/*.${ext}`;
  if (glob.startsWith('./')) {
    glob = glob.replace(/^\.\//, '');
  }
  // 要排除查找的文件 glob
  const exclude = rcConf?.exclude || '**/node_modules/**';
  // 最多查找的结果数量
  const maxResults = rcConf?.maxResults;

  fileWatcher = workspace.createFileSystemWatcher(glob);
  fileWatcher.onDidCreate((uri) => {
    storeCompletionItem(uri.fsPath);
  });
  fileWatcher.onDidChange((uri) => {
    log('change => ', uri.fsPath);
    storeCompletionItem(uri.fsPath);
  }, null, disposables);
  fileWatcher.onDidDelete((uri) => {
    const { fsPath } = uri;
    if (isLessFile(fsPath) && fileStore.has(fsPath)) {
      fileStore.delete(fsPath);
    }
  });

  workspace.findFiles(glob, exclude, maxResults).then((uris) => {
    uris.forEach((uri) => {
      storeCompletionItem(uri.fsPath);
    });
  });
}
