import { HttpHandler } from '@solid/community-server';
import { HttpHandlerInput } from '@solid/community-server';
import { NotImplementedHttpError } from '@solid/community-server';
import { KeyValueStorage } from '@solid/community-server';

/*
 * 以下、北海道情報大学専用で作ってたけど、汎用に作り変えてる途中。
 * 以下、北海道情報大学専用で作ってたけど、汎用に作り変えてる途中。
 * 以下、北海道情報大学専用で作ってたけど、汎用に作り変えてる途中。
 * 以下、北海道情報大学専用で作ってたけど、汎用に作り変えてる途中。
 * 以下、北海道情報大学専用で作ってたけど、汎用に作り変えてる途中。
 * 以下、北海道情報大学専用で作ってたけど、汎用に作り変えてる途中。
 * 以下、北海道情報大学専用で作ってたけど、汎用に作り変えてる途中。
 */

export type Idsrv2Data = {
  idsrv2Id: string, // 北海道情報大学の学籍番号、教職員番号を拡張したやつ
  accountId: string, // CSSのアカウントID
  googleId: string // 重複するけどこちらにも記録
};

const profileTemplate = `@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.

<BASE_URL_TEMPLATEpeople/IDSRV2_ID_TEMPLATE> a foaf:PersonalProfileDocument;
    foaf:maker <#me>;
    foaf:primaryTopic <#me>.

<#me> a foaf:Person;
    solid:oidcIssuer <BASE_URL_TEMPLATE>;
    <http://www.w3.org/ns/pim/space#preferencesFile> <BASE_URL_TEMPLATEpeople/IDSRV2_ID_TEMPLATEprefs.ttl>.
`;
const regex1 = /BASE_URL_TEMPLATE/g;
const regex2 = /IDSRV2_ID_TEMPLATE/g;
const profilePathRegexp = /^\/people\/[sf]\d{9}$/;
const preferencesPathRegexp = /^\/people\/[sf]\d{9}prefs.ttl$/;

/* 北海道情報大での使用を前提にしたWebIDのプロファイル情報を配信するHttpHandler */
export class Idsrv2ProfileHandler extends HttpHandler {
  private readonly baseUrl: string;
  private readonly idsrv2Storage: KeyValueStorage<string,Idsrv2Data>;

  public constructor(baseUrl: string, idsrv2Storage: KeyValueStorage<string,Idsrv2Data>) {
    super();
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl+'/';
    this.idsrv2Storage = idsrv2Storage;
  }

  // idsrv2Idはsかfで始まる10文字の文字列と決まっている
  createIdsrv2IdFromUrl(url: string): string {
//console.log("GAHA: Idsrv2ProfileHandler#createIdsrv2IdFromUrl: url=("+url+")");
    const isProfileMatch = url.match(profilePathRegexp);
    const isPreferencesMatch = url.match(preferencesPathRegexp);
    if (isProfileMatch) {
      return isProfileMatch[0].substring(8,18);
    } else if (isPreferencesMatch) {
      return isPreferencesMatch[0].substring(8,18);
    } else {
      throw new Error('Idsrv2ProfileHandler: error.');
    }
  }

  public async canHandle({ request }: HttpHandlerInput): Promise<void> {
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTION') {
      throw new NotImplementedHttpError('Only GET, HEAD and OPTION requests are supported');
    }
    if (request.url == undefined) {
      throw new Error('can not handle.');
    } else {
      const idsrv2Id = this.createIdsrv2IdFromUrl(request.url);
      const a = await this.idsrv2Storage.get(idsrv2Id);
      if (a)
        return;
      throw new Error('Idsrv2ProfileHandler: can not handle.');
    }
  }

  public async handle({ request, response }: HttpHandlerInput): Promise<void> {
//console.log("GAHA: Idsrv2ProfileHandler#handle: request.url=("+request.url+")");
    if (request.url == undefined) {
      throw new Error('Idsrv2ProfileHandler: 404?');
    }

    // CORS(Cross-Origin Resource Sharing)
    /*
    const origin = request.headers['Origin'];
    if (origin)
      response.setHeader('Access-Control-Allow-Origin', origin);
    else
      response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTION');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, access_token');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    */

    if (request.method === 'OPTION') {
      response.writeHead(200);
      response.end();
    } else if (request.url.endsWith('prefs.ttl')) {
      response.writeHead(200, { 'Content-Type': 'text/turtle' });
      response.write('');
      response.end();
    } else {
      const idsrv2Id = this.createIdsrv2IdFromUrl(request.url);
      const bodyStr = profileTemplate.replace(regex1, this.baseUrl).replace(regex2, idsrv2Id);
      response.writeHead(200, { 'Content-Type': 'text/turtle' });

      response.write(bodyStr);
      response.end();
    }
  }
}

