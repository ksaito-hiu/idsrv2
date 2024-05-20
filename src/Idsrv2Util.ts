import { getLoggerFor, joinFilePath } from '@solid/community-server';
import { readFile } from 'fs/promises';

/**
 * 
 */
export function getModuleRoot(): string {
  return joinFilePath(__dirname, '../');
}

/**
 * 
 */
export async function loadJson(file_path: string): Promise<any> {
  const str: string = await readFile(file_path,'utf-8');
  return JSON.parse(str) as any;
}
