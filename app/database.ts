import * as mongodb from "mongodb";
import { Table } from "./table";
 
export const collections: {
   tables?: mongodb.Collection<Table>;
} = {};
 
export async function connectToDatabase(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("tableApp");
   await applySchemaValidation(db);
 
   const tablesCollection = db.collection<Table>("tables");
   collections.tables = tablesCollection;
}
 
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",
           required: ["name", "party", "time"],
           additionalProperties: false,
           properties: {
               _id: {},
               name: {
                   bsonType: "string",
                   description: "'name' is required and is a string",
               },
               party: {
                   bsonType: "number",
                   description: "'party' is required and is a number",
                   maxLength: 6
               },
               time: {
                   bsonType: "string",
                   description: "'time' is required and is one of '7:00p', '7:30p', or '8:00p'",
                   enum: ["7:00", "8:00", "8:30"],
               },
           },
       },
   };

  await db.command({
       collMod: "tables",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("tables", {validator: jsonSchema});
        }
    });
 }
