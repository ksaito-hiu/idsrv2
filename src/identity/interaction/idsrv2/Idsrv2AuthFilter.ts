import { RegExpAuthFilter } from 'css-google-auth';
import { Idsrv2Settings } from '../../../Idsrv2Settings';

export class Idsrv2AuthFilter extends RegExpAuthFilter {
  constructor(settings: Idsrv2Settings) {
    const regexp = settings.idsrv2.mail_filter_regexp;
    super(regexp);
  }

  async check(tokenSet: any): Promise<void> {
    await super.check(tokenSet);
  }
}
