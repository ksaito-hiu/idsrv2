import { PostGAccountGen } from 'css-google-auth';
import type { WebIdStore } from '@solid/community-server';
import type { JsonResourceStorage } from '@solid/community-server';
import type { HiuData } from './HIUProfileHandler';

export class HIUPostGAccountGen implements PostGAccountGen {
  private readonly webIdStore: WebIdStore;
  private readonly baseUrl: string;
  private readonly hiuStorage: JsonResourceStorage<HiuData>;

  public constructor(webIdStore: WebIdStore, baseUrl: string, hiuStorage: JsonResourceStorage<HiuData>) {
    this.webIdStore = webIdStore;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl+'/';
console.log('GAHA: HIUAuthFilter, baseUrl=',this.baseUrl);
    this.hiuStorage = hiuStorage;
  }

  createIdsFromEMail(email: string) {
    if (email.endsWith('@s.do-johodai.ac.jp')) {
      return {
        webId: this.baseUrl+"people/s20"+email.substring(1,8)+'#me',
        hiuId: "s20"+email.substring(1,8)
      };
    } else if (email.endsWith('@do-johodai.ac.jp')) {
console.log('GAHA: HIUAuthFilter, email=',email);
      // ちょっと自分だけ前提でテスト
      return {
        webId: this.baseUrl+'people/f200088071#me',
        hiuId: 'f200088071'
      };
      //throw new Error('HIUPostGAccountGen: only students can be registered automaticaly. Please ask an administorator. email='+email);
    } else {
      console.log('HIUPostGAccountGen: invalid email=',email);
      throw new Error('HIUPostGAccountGen: invalid email='+email);
    }
  }

  async handle(accountId: string, googleId: string, tokenSet: any): Promise<void> {
    const email = tokenSet.claims().email;
console.log('GAHA1: email=', email);
    const { webId, hiuId } = this.createIdsFromEMail(email);
console.log('GAHA2: webId=', webId);
    const a = await this.webIdStore.create(webId, accountId);
    await this.hiuStorage.set(hiuId, {hiuId, accountId, googleId});
    return;
  }
}
