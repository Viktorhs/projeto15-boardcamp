import dotenv from 'dotenv'
import express from "express";
import cors from "cors";

import connection from "./src/db/dataBase.js"

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

app.get("/lista", async (req, res) => {
    try {
        const product = await connection.query(`
        SELECT * FROM categories `)

        res.send(product.rows);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

app.listen(4000, () => {
    console.log('Server is listening on port 4000.');
  });