import * as mongodb from "mongodb";

export interface Table {
  name: string;
  party: string;
  time: string;
  _id?: mongodb.ObjectId;
}
