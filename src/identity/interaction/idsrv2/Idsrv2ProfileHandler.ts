import { HttpHandler } from '@solid/community-server';
import { HttpHandlerInput } from '@solid/community-server';
import { NotImplementedHttpError } from '@solid/community-server';
import { KeyValueStorage } from '@solid/community-server';
import { Idsrv2Settings } from '../../../Idsrv2Settings';

export type Idsrv2Data = {
  idsrv2Id: string, // idsrv2用の簡単なid。
  accountId: string, // CSSのアカウントID
  googleId: string // 重複するけどこちらにも記録
};

const profileTemplate = `@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.

<BASE_URL_TEMPLATE/PROF_DIR_TEMPLATE/IDSRV2_ID_TEMPLATE> a foaf:PersonalProfileDocument;
    foaf:maker <#me>;
    foaf:primaryTopic <#me>.

<#me> a foaf:Person;
    solid:oidcIssuer <BASE_URL_TEMPLATE/>;
    <http://www.w3.org/ns/pim/space#preferencesFile> <BASE_URL_TEMPLATE/PROF_DIR_TEMPLATE/IDSRV2_ID_TEMPLATEprefs.ttl>.
`;
const regex1 = /BASE_URL_TEMPLATE/g;
const regex2 = /PROF_DIR_TEMPLATE/g;
const regex3 = /IDSRV2_ID_TEMPLATE/g;

/* WebIDのプロファイル情報、ついでにプリファレンス情報を配信するHttpHandler */
export class Idsrv2ProfileHandler extends HttpHandler {
  private readonly baseUrl: string;
  private readonly idsrv2Storage: KeyValueStorage<string,Idsrv2Data>;
  private readonly settings: Idsrv2Settings;
  private profilePathRegexp: RegExp;
  private preferencesPathRegexp: RegExp;

  public constructor(baseUrl: string, idsrv2Storage: KeyValueStorage<string,Idsrv2Data>, settings: Idsrv2Settings) {
    super();
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0,-1) : baseUrl;
    this.idsrv2Storage = idsrv2Storage;
    this.settings = settings;
    // this.settingsが初期化される前に実行されるのでとりあえず以下のようにする。
    this.profilePathRegexp = new RegExp('a'); // dummy;
    this.preferencesPathRegexp = new RegExp('b'); // dummy;
    setTimeout(()=>{
      this.profilePathRegexp = new RegExp('^/'+this.settings.idsrv2.profile_directory+'/(.*)$');
      this.preferencesPathRegexp = new RegExp('^/'+this.settings.idsrv2.profile_directory+'/(.*)prefs.ttl$');
    }, 3000);
  }

  // baseUrlからの相対urlからidsrv2Idを抽出する
  createIdsrv2IdFromUrl(url: string): string {
    const isPreferencesMatch = url.match(this.preferencesPathRegexp);
    const isProfileMatch = url.match(this.profilePathRegexp)
    if (isPreferencesMatch) { // からなずこっちからmatch！
      return isPreferencesMatch[1];
    } else if (isProfileMatch) {
      return isProfileMatch[1];
    } else {
      throw new Error('Idsrv2ProfileHandler: error.');
    }
  }

  public async canHandle({ request }: HttpHandlerInput): Promise<void> {
//console.log("GAHA: Idsrv2ProfileHandler#canHandle: request.url=("+request.url+")");
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

    if (request.method === 'OPTION') {
      response.writeHead(200);
      response.end();
    } else if (request.url.endsWith('prefs.ttl')) {
      response.writeHead(200, { 'Content-Type': 'text/turtle' });
      response.write('');
      response.end();
    } else {
      const idsrv2Id = this.createIdsrv2IdFromUrl(request.url);
      let bodyStr = profileTemplate.replace(regex1, this.baseUrl);
      bodyStr = bodyStr.replace(regex2, this.settings.idsrv2.profile_directory);
      bodyStr = bodyStr.replace(regex3, idsrv2Id);
      response.writeHead(200, { 'Content-Type': 'text/turtle' });

      response.write(bodyStr);
      response.end();
    }
  }
}

