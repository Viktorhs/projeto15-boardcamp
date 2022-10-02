import dotenv from 'dotenv';
import express from "express";
import cors from "cors";

import routerCategories from "./routes/categoriesRouters.js";
import routerGames from "./routes/gamesRouters.js";
import routerCustomers from "./routes/customersRouters.js"

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

app.use(routerCategories);
app.use(routerGames);
app.use(routerCustomers);

app.listen(4000, () => {
    console.log('Server is listening on port 4000.');
  });