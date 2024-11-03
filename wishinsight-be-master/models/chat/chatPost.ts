import { Timestamp } from "@google-cloud/firestore";
export interface IChatPost {
  from: string;
  id: string;
  message: string;
  to: string;
  created: number;
  seen: boolean;
}

export class DbChatMessage implements Required<IChatPost> {
  public from: string;
  public id: string;
  public message: string;
  public to: string;
  public created: number;
  public seen: boolean;

  constructor(chat: IChatPost) {
    this.from = chat.from || "";
    this.id = chat.id || "";
    this.message = chat.message || "";
    this.to = chat.to || "";
    this.seen = chat.seen || false;
    this.created = Timestamp.now().seconds;
  }
}
