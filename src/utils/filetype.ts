import { workspace } from 'vscode';
import * as path from 'path';

/**
 * Return a file extname without dot (`.`)
 * @param filePath file path
 */
export function getFileExtname(filePath: string) {
  const fileExt = path.extname(filePath).slice(1);
  return fileExt;
}

export function getLessFileAssociations() {
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

export function getVueFileAssociations() {
  const associations = workspace.getConfiguration('files.associations');
  if (!associations) {
    return ['vue'];
  }
  const extArray = Object.entries(associations).reduce((arr, [file, association]) => {
    if (association === 'vue') {
      const lastDotIndex = file.lastIndexOf('.');
      const ext = file.slice(lastDotIndex + 1);
      arr.push(ext);
    }
    return arr;
  }, [] as string[]);
  if (!extArray.includes('vue')) {
    extArray.push('vue');
  }
  return [...new Set(extArray)];
}

export function isLessFile(filePath: string) {
  const extname = getFileExtname(filePath);
  const lessAssociations = getLessFileAssociations();
  return lessAssociations.includes(extname);
}
export function isVueFile(filePath: string) {
  const extname = getFileExtname(filePath);
  const vueAssociations = getVueFileAssociations();
  return vueAssociations.includes(extname);
}
