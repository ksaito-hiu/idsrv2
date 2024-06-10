import { GoogleAuthFilter } from 'css-google-auth';

export class HIUAuthFilter implements GoogleAuthFilter {
  async check(tokenSet: any): Promise<void> {
    const email = tokenSet.claims().email;
    if (email.endsWith('@s.do-johodai.ac.jp')) {
      console.log('HIUAuthFilter: student email=',email);
    } else if (email.endsWith('@do-johodai.ac.jp')) {
      console.log('HIUAuthFilter: email=',email);
      //throw new Error('HIUAuthFilter: only students can be registered automaticaly. Please ask an administorator. email='+email);
    } else {
      console.log('HIUAuthFilter: invalid email=',email);
      throw new Error('HIUAuthFilter: invalid email='+email);
    }
    return;
  }
}
