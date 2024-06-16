import { Initializer } from '@solid/community-server';
import { getModuleRoot, loadJson } from './Idsrv2Util';

type Idsrv2 = {
  profile_directory: string;
  mail_filter_regexp: string;
  mailToId: { arg1: string; arg2: string};
  adminWebIds: Array<string>;
};
const idsrv2dummy = { profile_directory: '', mail_filter_regexp: '', mailToId: { arg1: '', arg2: ''}, adminWebIds: [] };
type User = { idsrv2_id: string; google_sub: string };
type Client = {
  client_id: string;
  client_secret: string;
  redirect_uris: Array<string>;
  post_logout_redirect_uris: Array<string>;
};

/**
 * 
 */
export class Idsrv2Settings extends Initializer {
  public idsrv2: Idsrv2;
  public users: Array<User>;
  public clients: Array<Client>;

  public constructor() {
//console.log("GAHA: Idsrv2Settings#constructor.");
    super();
    this.idsrv2 = idsrv2dummy;
    this.users = [];
    this.clients = [];
  }

  public async handle(input: void): Promise<void> {
//console.log("GAHA: Idsrv2Settings#handle.");
    const mRoot = getModuleRoot();
    this.idsrv2 = await loadJson(mRoot+'/settings/idsrv2.json');
    this.users = await loadJson(mRoot+'/settings/users.json');
    this.clients = await loadJson(mRoot+'/settings/clients.json');
  }
}
