import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";
 
export const tableRouter = express.Router();
tableRouter.use(express.json());
 
tableRouter.get("/", async (_req, res) => {
   try {
       const tables = await collections.tables.find({}).toArray();
       res.status(200).send(tables);
   } catch (error) {
       res.status(500).send(error.message);
   }
});

tableRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const table = await collections.tables.findOne(query);
  
        if (table) {
            res.status(200).send(table);
        } else {
            res.status(404).send(`Failed to find table: ID ${id}`);
        }
  
    } catch (error) {
        res.status(404).send(`Failed to find table: ID ${req?.params?.id}`);
    }
 });

 tableRouter.post("/", async (req, res) => {
    try {
        const table = req.body;
        const result = await collections.tables.insertOne(table);
  
        if (result.acknowledged) {
            res.status(201).send(`Created a new table: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new table.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
 });

 tableRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const table = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.tables.updateOne(query, { $set: table });
  
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an table: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an table: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an table: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });

 tableRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.tables.deleteOne(query);
  
        if (result && result.deletedCount) {
            res.status(202).send(`Removed an table: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an table: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an table: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
 });