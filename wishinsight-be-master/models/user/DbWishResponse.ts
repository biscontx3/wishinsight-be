export interface DbWishResponse {
  id: string;
  title: string;
  amount: number;
  price: number;
  created: number;
  recurring: string;
  category: string;
}

export class WishResponse implements Required<DbWishResponse> {
  public title: string;
  public id: string;
  public amount: number;
  public created: number;
  public price: number;
  public recurring: string;
  public category: string;

  constructor(data: DbWishResponse) {
    this.title = data.title || "";
    this.id = data.id || "";
    this.recurring = data.recurring || "";
    this.category = data.category || "";
    this.amount = data.amount || 0;
    this.created = data.created || 0;
    this.price = data.price || 0;
  }
}
