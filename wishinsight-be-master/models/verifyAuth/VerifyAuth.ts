export interface DbVerifyAuth {
  token: string;
}

export class VerifyAuth implements Required<DbVerifyAuth> {
  public token: string;

  constructor(data: DbVerifyAuth) {
    this.token = data.token || "";
  }
}
