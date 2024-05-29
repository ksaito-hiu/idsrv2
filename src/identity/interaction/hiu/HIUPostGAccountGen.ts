import { PostGAccountGen } from 'css-google-auth';
import type { WebIdStore } from '@solid/community-server';

export class HIUPostGAccountGen implements PostGAccountGen {
  private readonly webIdStore: WebIdStore;
  private readonly webIdBase: string;

  public constructor(webIdStore: WebIdStore, webIdBase: string) {
    this.webIdStore = webIdStore;
    this.webIdBase = webIdBase;
  }

  createWebIdFromEMail(email: string): string {
    if (email.endsWith('@s.do-johodai.ac.jp')) {
      return this.webIdBase+"s20"+email.substring(1,8)+'#me';
    } else if (email.endsWith('@do-johodai.ac.jp')) {
      return this.webIdBase+'f200088071#me'; // ちょっと自分だけ前提でテスト
      console.log('HIUAuthFilter: email=',email);
      //throw new Error('HIUPostGAccountGen: only students can be registered automaticaly. Please ask an administorator. email='+email);
    } else {
      console.log('HIUPostGAccountGen: invalid email=',email);
      throw new Error('HIUPostGAccountGen: invalid email='+email);
    }
  }

  async handle(accountId: string, googleId: string, tokenSet: any): Promise<void> {
    const email = tokenSet.claims().email;
console.log('GAHA1: email=', email);
    const webId = this.createWebIdFromEMail(email);
console.log('GAHA2: webId=', webId);
    const a = await this.webIdStore.create(webId, accountId);
    return;
  }
}
