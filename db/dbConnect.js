// external imports
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  // use mongoose to connect this app to our database on mongoDB using the DB_URL (connection string)
  mongoose
    .connect(process.env.DB_URL, {})
    .then(() => {
      console.log("Successfully connected to MongoDB Database!");
    })
    .catch((error) => {
      console.log("Unable to connect to Database!");
      console.error(error);
    });
}

module.exports = dbConnect;
