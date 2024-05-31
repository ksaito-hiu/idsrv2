import { HttpHandler } from '@solid/community-server';
import { HttpHandlerInput } from '@solid/community-server';
import { NotImplementedHttpError } from '@solid/community-server';

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

/* 北海道情報大での使用を前提にしたWebIDのプロファイル情報を配信するHttpHandler */
export class HIUProfileHandler extends HttpHandler {
  private readonly profileRoot: string;
  private readonly issuerUrl: string;

  public constructor(profileRoot: string, issuerUrl: string) {
    super();
    this.profileRoot = profileRoot;
    this.issuerUrl = issuerUrl;
  }

  public async canHandle({ request }: HttpHandlerInput): Promise<void> {
console.log("GAHA: HIUProfileHandler#canHandle: request.url=("+request.url+")");
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      throw new NotImplementedHttpError('Only GET and HEAD requests are supported');
    }
    if (request.url == undefined) {
      throw new Error('can not handle.');
    } else if (request.url.startsWith('/people/')) {
      return;
    } else {
      throw new Error('can not handle.');
    }
  }

  public async handle({ request, response }: HttpHandlerInput): Promise<void> {
console.log("GAHA: HIUProfileHandler#handle: request.url=("+request.url+")");
    const id = 'f200088071'; // GAHA; TODO
    const webId = this.profileRoot + id + '#me';
    const bodyStr = profileTemplate.replace(regex1, webId).replace(regex2, this.issuerUrl);
    response.writeHead(200, { 'content-type': 'text/tutle' });
    response.write(bodyStr);
    response.end();
  }
}

