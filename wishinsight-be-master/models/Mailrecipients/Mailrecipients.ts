export interface IMailRecipients {
  to?: string[];
  cc?: string[];
  bcc?: string[];
}

export class MailRecipients implements IMailRecipients {
  public to: string[];
  public cc?: string[];
  public bcc?: string[];

  constructor(recipients?: IMailRecipients) {
    this.to = recipients?.to || [];
    this.cc = recipients?.cc;
    this.bcc = recipients?.bcc;
  }
}
