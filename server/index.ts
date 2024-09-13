//www.youtube.com/watch?v=pJx-HGwaL3w&list=PLpPqplz6dKxUaZ630TY1BFIo5nP-_x-nL&index=2

import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { json } from "express";
const app = express();
const port = process.env.SERVER_PORT ?? 3000;

app.use(cors());
app.use(json());

import { sequelize } from "./models/index.js";

// Routers
import albumRouter from "./routes/Album.js";
app.use("/album", albumRouter);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
