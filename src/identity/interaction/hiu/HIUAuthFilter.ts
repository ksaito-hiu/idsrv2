import { GoogleAuthFilter } from 'css-google-auth';

export class HIUAuthFilter implements GoogleAuthFilter {
  async check(tokenSet: any): Promise<void> {
console.log('GAHA: ',tokenSet);
    return;
  }
}
