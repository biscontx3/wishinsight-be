export interface DbResponseToken {
  token: string;
}

export class ResponseToken implements Required<DbResponseToken> {
  public token: string;

  constructor(data: DbResponseToken) {
    this.token = data.token || "";
  }
}
