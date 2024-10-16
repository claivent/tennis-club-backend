import * as mongodb from "mongodb";

export interface Table {
  name: string;
  party: string;
  time: string;
  date: number;
  _id?: mongodb.ObjectId;
}
