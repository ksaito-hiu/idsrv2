import { HttpHandler } from '@solid/community-server';
import { HttpHandlerInput } from '@solid/community-server';
import { NotImplementedHttpError } from '@solid/community-server';
import { JsonResourceStorage } from '@solid/community-server';

export type HiuData = {
  hiuId: string, // 北海道情報大学の学籍番号、教職員番号を拡張したやつ
  accountId: string, // CSSのアカウントID
  googleId: string // 重複するけどこちらにも記録
};

const profileTemplate = `@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.

<>
    a foaf:PersonalProfileDocument;
    foaf:maker <WEB_ID_TEMPLATE>;
    foaf:primaryTopic <WEB_ID_TEMPLATE>.

<WEB_ID_TEMPLATE>
    
    solid:oidcIssuer <OIDC_ISSUER_TEMPLATE>;
    a foaf:Person.
`;
const regex1 = /WEB_ID_TEMPLATE/g;
const regex2 = /OIDC_ISSUER_TEMPLATE/g;
const hiuIdRegexp = /\/people\/[sf]\d{9}/;

/* 北海道情報大での使用を前提にしたWebIDのプロファイル情報を配信するHttpHandler */
export class HIUProfileHandler extends HttpHandler {
  private readonly profileRoot: string;
  private readonly issuerUrl: string;
  private readonly hiuStorage: JsonResourceStorage<HiuData>;

  public constructor(profileRoot: string, issuerUrl: string, hiuStorage: JsonResourceStorage<HiuData>) {
    super();
    this.profileRoot = profileRoot;
    this.issuerUrl = issuerUrl;
    this.hiuStorage = hiuStorage;
  }

  createHiuIdFromUrl(url: string): string {
//console.log("GAHA: HIUProfileHandler#createHiuIdFromUrl: url=("+url+")");
    if (url.length === 18) { // '/people/s202421000'.length === 18
      const m = url.match(hiuIdRegexp);
      if (m) {
        return m[0].substring(8);
      } else {
        throw new Error('HIUProfileHandler: error1.');
      }
    }
    throw new Error('HIUProfileHandler: error2.');
  }

  public async canHandle({ request }: HttpHandlerInput): Promise<void> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      throw new NotImplementedHttpError('Only GET and HEAD requests are supported');
    }
    if (request.url == undefined) {
      throw new Error('can not handle.');
    } else {
      const hiuId = this.createHiuIdFromUrl(request.url);
      const a = await this.hiuStorage.get(hiuId);
      if (a)
        return;
      throw new Error('HIUProfileHandler: can not handle.');
    }
  }

  public async handle({ request, response }: HttpHandlerInput): Promise<void> {
//console.log("GAHA: HIUProfileHandler#handle: request.url=("+request.url+")");
    if (request.url == undefined) {
      throw new Error('HIUProfileHandler: 404?');
    }
    const id = this.createHiuIdFromUrl(request.url);
    const webId = this.profileRoot + id + '#me';
    const bodyStr = profileTemplate.replace(regex1, webId).replace(regex2, this.issuerUrl);
    response.writeHead(200, { 'content-type': 'text/tutle' });
    response.write(bodyStr);
    response.end();
  }
}

