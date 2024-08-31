import { PostGAccountGen } from 'css-google-auth';
import type { WebIdStore } from '@solid/community-server';
import type { JsonResourceStorage } from '@solid/community-server';
import type { Idsrv2Data } from './Idsrv2ProfileHandler';
import type { Idsrv2Settings } from '../../../Idsrv2Settings';

export class Idsrv2PostGAccountGen implements PostGAccountGen {
  private readonly webIdStore: WebIdStore;
  private readonly baseUrl: string;
  private readonly idsrv2Storage: JsonResourceStorage<Idsrv2Data>;
  private readonly settings: Idsrv2Settings;

  public constructor(webIdStore: WebIdStore, baseUrl: string, idsrv2Storage: JsonResourceStorage<Idsrv2Data>, settings: Idsrv2Settings) {
    this.webIdStore = webIdStore;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0,-1) : baseUrl;
    this.idsrv2Storage = idsrv2Storage;
    this.settings = settings;
  }

  createIdsFromEMail(email: string) {
    let idsrv2Id;
if (email==="ksaito@do-johodai.ac.jp") {
    idsrv2Id = "f200088071"; // 自分だけテスト
} else {
    idsrv2Id = email.replace(this.settings.idsrv2.mailToId.arg1,this.settings.idsrv2.mailToId.arg2);
    if (email === idsrv2Id)
      throw new Error('Idsrv2PostGAccountGen: could not get idsrv2Id from email. email='+email);
}
    return {
      webId: this.baseUrl+"/"+this.settings.idsrv2.profile_directory+"/"+idsrv2Id+'#me',
      idsrv2Id
    };
  }

  async handle(accountId: string, googleId: string, tokenSet: any): Promise<void> {
    const email = tokenSet.claims().email;
console.log('GAHA1: email=', email);
    const { webId, idsrv2Id } = this.createIdsFromEMail(email);
console.log('GAHA2: webId=', webId);
console.log('GAHA3: googleId=', googleId);
    const a = await this.webIdStore.create(webId, accountId);
    await this.idsrv2Storage.set(idsrv2Id, {idsrv2Id, accountId, googleId});
    return;
  }
}
