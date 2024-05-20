import { PostGAccountGen } from 'css-google-auth';

export class HIUPostGAccountGen implements PostGAccountGen {
  async handle(accountId: string, googleId: string, tokenSet: any): Promise<void> {
console.log('GAHA1: ', accountId);
console.log('GAHA2: ', googleId);
console.log('GAHA3: ', tokenSet);
    return;
  }
}
