import { PostGAccountGen } from 'css-google-auth';
import type { WebIdStore } from '@solid/community-server';
import type { JsonResourceStorage } from '@solid/community-server';
import type { Idsrv2Data } from './Idsrv2ProfileHandler';

export class Idsrv2PostGAccountGen implements PostGAccountGen {
  private readonly webIdStore: WebIdStore;
  private readonly baseUrl: string;
  private readonly idsrv2Storage: JsonResourceStorage<Idsrv2Data>;

  public constructor(webIdStore: WebIdStore, baseUrl: string, idsrv2Storage: JsonResourceStorage<Idsrv2Data>) {
    this.webIdStore = webIdStore;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl+'/';
console.log('GAHA: Idsrv2PostGAccountGen, baseUrl=',this.baseUrl);
    this.idsrv2Storage = idsrv2Storage;
  }

  createIdsFromEMail(email: string) {
    if (email.endsWith('@s.do-johodai.ac.jp')) {
      return {
        webId: this.baseUrl+"people/s20"+email.substring(1,8)+'#me',
        idsrv2Id: "s20"+email.substring(1,8)
      };
    } else if (email.endsWith('@do-johodai.ac.jp')) {
console.log('GAHA: Idsrv2PostGAccountGen, email=',email);
      // ちょっと自分だけ前提でテスト
      return {
        webId: this.baseUrl+'people/f200088071#me',
        idsrv2Id: 'f200088071'
      };
      //throw new Error('Idsrv2PostGAccountGen: only students can be registered automaticaly. Please ask an administorator. email='+email);
    } else {
      console.log('Idsrv2PostGAccountGen: invalid email=',email);
      throw new Error('Idsrv2PostGAccountGen: invalid email='+email);
    }
  }

  async handle(accountId: string, googleId: string, tokenSet: any): Promise<void> {
    const email = tokenSet.claims().email;
console.log('GAHA1: email=', email);
    const { webId, idsrv2Id } = this.createIdsFromEMail(email);
console.log('GAHA2: webId=', webId);
    const a = await this.webIdStore.create(webId, accountId);
    await this.idsrv2Storage.set(idsrv2Id, {idsrv2Id, accountId, googleId});
    return;
  }
}
