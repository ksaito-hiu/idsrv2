import { object, string } from 'yup';
import { validateWithError } from '@solid/community-server';
import { JsonInteractionHandler } from '@solid/community-server';
import { JsonInteractionHandlerInput } from '@solid/community-server';
import { AccountStore } from '@solid/community-server';
import { KeyValueStorage } from '@solid/community-server';
import { WebIdStore } from '@solid/community-server';
import { JsonRepresentation } from '@solid/community-server';
import { GoogleStore } from 'css-google-auth';
import { HiuData } from './HIUProfileHandler';

type OutType = { output: string };

const inSchema = object({
  kind: string().trim().required(), // 処理の種類
  data: string().trim().required() // 良くないけど汎用
});

export interface HIUAdminHandlerArgs {
  baseUrl: string;
  accountStore: AccountStore;
  hiuStorage: KeyValueStorage<string,HiuData>;
  webIdStore: WebIdStore;
  googleStore: GoogleStore;
  adminWebIds: string[];
}

/* 北海道情報大の管理者用API */
export class HIUAdminHandler extends JsonInteractionHandler {
  private readonly baseUrl: string;
  private readonly accountStore: AccountStore;
  private readonly hiuStorage: KeyValueStorage<string,HiuData>;
  private readonly webIdStore: WebIdStore;
  private readonly googleStore: GoogleStore;
  private readonly adminWebIds: string[];

  public constructor(args: HIUAdminHandlerArgs) {
    super();
    this.baseUrl = args.baseUrl;
    this.accountStore = args.accountStore;
    this.hiuStorage = args.hiuStorage;
    this.webIdStore = args.webIdStore;
    this.googleStore = args.googleStore;
    this.adminWebIds = args.adminWebIds;
    console.log("HIUAdminHandler GAHA0: this.adminWebIds=this.adminWebIds");
  }

  async checkPermission(input: JsonInteractionHandlerInput): Promise<void> {
    if (!input.accountId) {
      throw new Error('Login is required.');
    }
    const webIds = await this.webIdStore.findLinks(input.accountId);
    let check = false;
    webIds.forEach((id)=> {
      this.adminWebIds.forEach((aid)=> {
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
    await this.checkPermission(input);
  }

  public async handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation<OutType>> {
    await this.checkPermission(input);
    const { kind, data } = await validateWithError(inSchema, input.json);
    if (kind === 'addAccount') {
      const [googleSub,hiuId] = data.split(',')
      const accountId = await this.accountStore.create();
      const googleId = await this.googleStore.create(googleSub, accountId); // ダブリチェックあり
      const webId = this.baseUrl + 'people/' + hiuId + '#me';
      const widIdId = await this.webIdStore.create(webId, accountId);
      await this.hiuStorage.set(hiuId, {hiuId, accountId, googleId});
      return { json: { output: 'ok,accountId='+accountId+',googleId='+googleId+',' } };
    } else if (kind === 'dummy') {
      return { json: { output: 'dummy' } };
    } else {
      return { json: { output: 'no kind error' } };
    }
  }
}

