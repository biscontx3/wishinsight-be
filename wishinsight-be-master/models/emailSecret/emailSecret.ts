export interface IEmailSecret {
  clientId?: string;
  clientSecret?: string;
  username?: string;
  password?: string;
}

export class EmailSecret implements IEmailSecret {
  public clientId: string;
  public clientSecret: string;
  public username: string;
  public password: string;

  constructor(secret?: IEmailSecret) {
    this.clientId = secret?.clientId || "";
    this.clientSecret = secret?.clientSecret || "0";
    this.username = secret?.username || "";
    this.password = secret?.password || "";
  }
}
