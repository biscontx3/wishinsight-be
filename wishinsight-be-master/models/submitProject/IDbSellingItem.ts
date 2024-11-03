import { Timestamp } from "@google-cloud/firestore";
export class DbSellingItem {
  id: string = "";
  title: string = "";
  urlTitle: string = "";
  category: string = "";
  created: number;
  status: string = "pending";
  isPromoted: boolean = false;
  createdBy: string = "";
  zipcode: number = 0;

  constructor(obj?: DbSellingItem) {
    this.id = obj?.id || "";
    this.status = obj?.status || "";
    this.title = obj?.title || "";
    this.created = Timestamp.now().seconds;
    this.urlTitle = obj?.urlTitle?.toLowerCase().trim() || "";
    this.category = obj?.category || "";
    this.createdBy = obj?.createdBy || "";
    this.isPromoted = obj?.isPromoted || false;
    this.zipcode = obj?.zipcode || 0;
  }
}
