export interface DbGuestItem {
  id: string;
  title: string;
  price: number;
  category: string;
  createdBy: string;
  amount: number;
  recurring: string;
}

export class GuestItem implements Required<DbGuestItem> {
  public title: string;
  public id: string;
  public price: number;
  public amount: number;
  public category: string;
  public createdBy: string;
  public recurring: string;

  constructor(data: DbGuestItem) {
    this.title = data.title || "";
    this.id = data.id || "";
    this.category = data.category || "";
    this.createdBy = data.createdBy || "";
    this.recurring = data.recurring || "";
    this.price = data.price || 0;
    this.amount = data.amount || 0;
  }
}
