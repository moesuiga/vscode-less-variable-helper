import { workspace } from 'vscode';
import * as path from 'path';
import { fileStore } from './utils/store';

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

export function readAllLessFiles(): void {
  const lessAssociations = getLessFileAssociations();
  const ext = lessAssociations.length === 1 ? lessAssociations[0] : `{${lessAssociations.join(',')}}`;
  const glob = `**/*.${ext}`;

  const fileWatcher = workspace.createFileSystemWatcher(glob);
  fileWatcher.onDidCreate((uri) => {
    storeCompletionItem(uri.fsPath);
  });
  fileWatcher.onDidChange((uri) => {
    storeCompletionItem(uri.fsPath);
  });
  fileWatcher.onDidDelete((uri) => {
    const { fsPath } = uri;
    if (isLessFile(fsPath) && fileStore.has(fsPath)) {
      fileStore.delete(fsPath);
    }
  });

  workspace.findFiles(glob).then((uris) => {
    uris.forEach((uri) => {
      storeCompletionItem(uri.fsPath);
    });
  });
}
