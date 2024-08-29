import { Initializer } from '@solid/community-server';
import { getModuleRoot, loadJson } from './Idsrv2Util';

type Idsrv2 = {
  profile_directory: string;
  mail_filter_regexp: string;
  mailToId: { arg1: string; arg2: string};
  adminWebIds: Array<string>;
};
const idsrv2dummy = { profile_directory: '', mail_filter_regexp: '', mailToId: { arg1: '', arg2: ''}, adminWebIds: [] };

/**
 * 
 */
export class Idsrv2Settings extends Initializer {
  public idsrv2: Idsrv2;

  public constructor() {
    super();
    this.idsrv2 = idsrv2dummy;
    const mRoot = getModuleRoot();
    this.idsrv2 = loadJson(mRoot+'/settings/idsrv2.json');
  }

  public async handle(input: void): Promise<void> {
  }
}
