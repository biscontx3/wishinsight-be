import { Timestamp } from "@google-cloud/firestore";
export class DbDemandItem {
  id: string = "";
  title: string = "";
  urlTitle: string = "";
  category: string = "";
  description: string = "";
  price: number = 0;
  country: string = "";
  amount: number = 0;
  created: number;
  status: string = "pending";
  recurring: string = "once";
  isPromoted: boolean = false;
  paid: boolean = false;
  createdBy: string = "";
  type: string = "";
  zipcode: number = 0;

  constructor(obj?: DbDemandItem) {
    this.id = obj?.id || "";
    this.status = obj?.status || "";
    this.title = obj?.title || "";
    this.recurring = obj?.recurring || "";
    this.price = obj?.price || 0;
    this.created = Timestamp.now().seconds;
    this.urlTitle = obj?.urlTitle?.toLowerCase().trim() || "";
    this.category = obj?.category || "";
    this.createdBy = obj?.createdBy || "";
    this.description = obj?.description || "";
    this.type = obj?.type || "";
    this.country = obj?.country || "";
    this.amount = obj?.amount || 0;
    this.isPromoted = obj?.isPromoted || false;
    this.paid = obj?.paid || false;
    this.zipcode = obj?.zipcode || 0;
  }
}
