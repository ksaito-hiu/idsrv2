import { object, string } from 'yup';
import { validateWithError } from '@solid/community-server';
import { JsonInteractionHandler } from '@solid/community-server';
import { JsonInteractionHandlerInput } from '@solid/community-server';
import { AccountStore } from '@solid/community-server';
import { KeyValueStorage } from '@solid/community-server';
import { WebIdStore } from '@solid/community-server';
import { JsonRepresentation } from '@solid/community-server';
import { GoogleStore } from 'css-google-auth';
import { Idsrv2Data } from './Idsrv2ProfileHandler';
import { Idsrv2Settings } from '../../../Idsrv2Settings';

type OutType = { output: string };

const inSchema = object({
  kind: string().trim().required(), // 処理の種類
  data: string().trim().required() // 良くないけど汎用
});

export interface Idsrv2AdminHandlerArgs {
  baseUrl: string;
  accountStore: AccountStore;
  idsrv2Storage: KeyValueStorage<string,Idsrv2Data>;
  webIdStore: WebIdStore;
  googleStore: GoogleStore;
  settings: Idsrv2Settings;
}

/* 北海道情報大の管理者用API */
export class Idsrv2AdminHandler extends JsonInteractionHandler {
  private readonly baseUrl: string;
  private readonly accountStore: AccountStore;
  private readonly idsrv2Storage: KeyValueStorage<string,Idsrv2Data>;
  private readonly webIdStore: WebIdStore;
  private readonly googleStore: GoogleStore;
  private readonly settings: Idsrv2Settings;

  public constructor(args: Idsrv2AdminHandlerArgs) {
    super();
    this.baseUrl = args.baseUrl;
    this.accountStore = args.accountStore;
    this.idsrv2Storage = args.idsrv2Storage;
    this.webIdStore = args.webIdStore;
    this.googleStore = args.googleStore;
    this.settings = args.settings;
  }

  // この方法で権限チェックするのではなくWebACLの仕組みで権限設定する方法に
  // したので、結局使わないけどコードだけ残しておく。
  async checkPermission(input: JsonInteractionHandlerInput): Promise<void> {
    if (!input.accountId) {
      throw new Error('Login is required.');
    }
    const webIds = await this.webIdStore.findLinks(input.accountId);
    let check = false;
    webIds.forEach((id)=> {
      this.settings.idsrv2.adminWebIds.forEach((aid)=> {
        if (id.webId === aid) {
          check = true;
        }
      });
    });
    if (!check) {
      throw new Error('You are not an administorator.');
    }
  }

  public async canHandle(input: JsonInteractionHandlerInput): Promise<void> {
    //await this.checkPermission(input);
  }

  public async handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation<OutType>> {
    //await this.checkPermission(input);
    const { kind, data } = await validateWithError(inSchema, input.json);
    if (kind === 'addAccount') {
      const [googleSub,idsrv2Id] = data.split(',')
      const accountId = await this.accountStore.create();
      const googleId = await this.googleStore.create(googleSub, accountId); // ダブリチェックあり
      const webId = this.baseUrl + 'people/' + idsrv2Id + '#me';
      const widIdId = await this.webIdStore.create(webId, accountId);
      await this.idsrv2Storage.set(idsrv2Id, {idsrv2Id, accountId, googleId});
      return { json: { output: 'ok,accountId='+accountId+',googleId='+googleId+',' } };
    } else if (kind === 'dummy') {
      return { json: { output: 'dummy' } };
    } else {
      return { json: { output: 'no kind error' } };
    }
  }
}

