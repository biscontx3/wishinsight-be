import { Timestamp } from "@google-cloud/firestore";
export interface IDbItem {
  img?: string;
  name: string;
  urlName: string;
  created: number;
  amount: number;
  description: string;
}

export class DbItem implements Required<IDbItem> {
  public img: string;
  public name: string;
  public urlName: string;
  public description: string;
  public created: number;
  public amount: number;

  constructor(project: IDbItem) {
    this.img = project.img || "";
    this.name = project.name || "";
    this.urlName = project.urlName || "";
    this.description = project.description || "";
    this.amount = project.amount || 0;
    this.created = Timestamp.now().seconds;
  }
}
