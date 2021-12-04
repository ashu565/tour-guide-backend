const express = require("express");
const morgan = require("morgan");
const cors = require("cors");



const app = express();

//parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// allow other request to get access
app.use(cors());

app.use("/api/v1/auth", require('./Routes/authRoutes'));

module.exports = app;
