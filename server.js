const dotenv = require('dotenv');
const mongoose = require('mongoose')
const authRoute = require("./routes/authRoutes");
dotenv.config();

const app = require("./app");
const port = process.env.PORT || 3000;

const DB = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then((con) => {
    // console.log(con.connection);
    console.log("DB connection success");
  });

app.use("/api/v1/auth", authRoute);

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
