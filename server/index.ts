//www.youtube.com/watch?v=pJx-HGwaL3w&list=PLpPqplz6dKxUaZ630TY1BFIo5nP-_x-nL&index=2

import dotenv from "dotenv";
import cors from "cors";
import express, { json } from "express";
import { db } from "./models/";
import albumRouter from "./routes/Album";
import repositoryRouter from "./routes/Repository";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT ?? 3000;

app.use(cors());
app.use(json());

// Routers
app.use("/album", albumRouter);
app.use("/repository", repositoryRouter);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
