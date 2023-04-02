const express = require("express");
const db = require("./database");
const route = require("./routes");
const app = express();
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3500;
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/E7686", route);
const MyApp = {
  start: () => {
    db.once("open", () => {
      app.listen(PORT, () => {
        console.log(`Connected to: ${db.name}`);
        console.log(`App running on port ${PORT}`);
      });
    });
  },
};
module.exports = MyApp;
