import { object, string } from 'yup';
import { JsonInteractionHandler } from '@solid/community-server';
import { JsonInteractionHandlerInput } from '@solid/community-server';
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
  hiuStorage: KeyValueStorage<string,HiuData>;
  webIdStore: WebIdStore;
  googleStore: GoogleStore;
  adminWebIds: string[];
}

/* 北海道情報大の管理者用API */
export class HIUAdminHandler extends JsonInteractionHandler {
  private readonly hiuStorage: KeyValueStorage<string,HiuData>;
  private readonly webIdStore: WebIdStore;
  private readonly googleStore: GoogleStore;
  private readonly adminWebIds: string[];

  public constructor(args: HIUAdminHandlerArgs) {
    super();
    this.hiuStorage = args.hiuStorage;
    this.webIdStore = args.webIdStore;
    this.googleStore = args.googleStore;
    this.adminWebIds = args.adminWebIds;
    console.log("HIUAdminHandler GAHA0: this.adminWebIds=this.adminWebIds");
  }

  public async canHandle(input: JsonInteractionHandlerInput): Promise<void> {
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

  public async handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation<OutType>> {
    return { json: { output: 'abc' } };
  }
}

