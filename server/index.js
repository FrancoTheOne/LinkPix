//www.youtube.com/watch?v=pJx-HGwaL3w&list=PLpPqplz6dKxUaZ630TY1BFIo5nP-_x-nL&index=2

https: require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.SERVER_PORT ?? 3000;

app.use(cors());
app.use(express.json());

const db = require("./models");

// Routers
const albumRouter = require("./routes/Album");
app.use("/album", albumRouter);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
