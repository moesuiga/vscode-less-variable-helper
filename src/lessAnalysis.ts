import { Disposable, FileSystemWatcher, workspace } from 'vscode';
import * as path from 'path';
import { fileStore } from './utils/store';
import { getRCConfig } from './config';
import { log } from './utils/log';

/**
 * Return a file extname without dot (`.`)
 * @param filePath file path
 */
function getFileExtname(filePath: string) {
  const fileExt = path.extname(filePath).slice(1);
  return fileExt;
}

function getLessFileAssociations() {
  const associations = workspace.getConfiguration('files.associations');
  if (!associations) {
    return ['less'];
  }
  const extArray = Object.entries(associations).reduce((arr, [file, association]) => {
    if (association === 'less') {
      const lastDotIndex = file.lastIndexOf('.');
      const ext = file.slice(lastDotIndex + 1);
      arr.push(ext);
    }
    return arr;
  }, [] as string[]);
  if (!extArray.includes('less')) {
    extArray.push('less');
  }
  return [...new Set(extArray)];
}

function isLessFile(filePath: string) {
  const extname = getFileExtname(filePath);
  const lessAssociations = getLessFileAssociations();
  return lessAssociations.includes(extname);
}

function storeCompletionItem(filePath: string) {
  if (isLessFile(filePath)) {
    fileStore.set(filePath);
  }
}

let fileWatcher: null | FileSystemWatcher = null;

export function readAllLessFiles(disposables: Disposable[]) {
  if (fileWatcher) {
    fileWatcher.dispose();
  }
  const lessAssociations = getLessFileAssociations();
  const ext = lessAssociations.length === 1 ? lessAssociations[0] : `{${lessAssociations.join(',')}}`;

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
