import { workspace } from 'vscode';
import * as path from 'path';
import { fileStore } from './utils/store';

function storeCompletionItem(filePath: string) {
  if (isLessFile(filePath)) {
    fileStore.set(filePath);
  }
}

/**
 * Return imported other file paths
 * @param data less file content
 */
function getImportRule(data: string) {
  const importReg = /^\s*@import\s+(?:\(\w+\)\s+)?(['"])([^'"]+)\1\s*;\s*$/gm;
  const imports: string[] = [];
  let match: RegExpExecArray | null;
  while(match = importReg.exec(data)) {
    imports.push(match[2]);
  }
  return imports.filter((p) => !!(p && p.trim()));
}

/**
 * Return a file extname without dot (`.`)
 * @param filePath file path
 */
function getFileExtname(filePath: string) {
  const fileExt = path.extname(filePath).slice(1);
  return fileExt;
}
function isLessFile(filePath: string) {
  const extname = getFileExtname(filePath);
  const lessAssociations = getLessFileAssociations();
  return lessAssociations.includes(extname);
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
  return extArray;
}


export function readAllLessFiles() {
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
    storeCompletionItem(uri.fsPath);
  });

  workspace.findFiles(glob).then((uris) => {
    uris.forEach((uri) => {
      storeCompletionItem(uri.fsPath);
    });
  });
}
