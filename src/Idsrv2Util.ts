import { getLoggerFor, joinFilePath } from '@solid/community-server';
//import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';

/**
 * 
 */
export function getModuleRoot(): string {
  return joinFilePath(__dirname, '../');
}

/**
 * 
 */
export function loadJson(file_path: string): any {
  const str: string = readFileSync(file_path,'utf-8');
  return JSON.parse(str) as any;
}
