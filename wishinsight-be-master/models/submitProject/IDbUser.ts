import { Timestamp } from "@google-cloud/firestore";

export interface IDbUser {
  username: string;
  password: string;
  email: string;
  items: string[];
  created?: number;
  zipcode: string;
  country?: string;
  confirmed: boolean;
}

export class DbUser implements Required<IDbUser> {
  public username: string;
  public password: string;
  public email: string;
  public items: string[];
  public created: number;
  public zipcode: string;
  public country: string;
  public confirmed: boolean;

  constructor(data: IDbUser) {
    this.username = data?.username.toLowerCase() || "";
    this.email = data?.email.toLowerCase() || "";
    this.password = data.password || "";
    this.items = data.items || [];
    this.created = Timestamp.now().seconds;
    this.zipcode = data.zipcode || "";
    this.country = data?.country || "";
    this.confirmed = data?.confirmed || false;
  }
}
