export interface DbSellingResponse {
  id: string;
  title: string;
  created: number;
  category: string;
}

export class SellingResponse implements Required<DbSellingResponse> {
  public title: string;
  public id: string;
  public created: number;
  public category: string;

  constructor(data: DbSellingResponse) {
    this.title = data.title || "";
    this.id = data.id || "";
    this.category = data.category || "";
    this.created = data.created || 0;
  }
}
