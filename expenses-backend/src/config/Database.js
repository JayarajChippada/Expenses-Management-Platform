const mongoose = require("mongoose");

const { MONGO_URI } = require("./Configs");

const connectDB = async () => {
  try {
    mongoose

      .connect(MONGO_URI)

      .then((result) => {
        console.log("Database Connected!");
      })

      .catch((err) => {
        console.log("Error: " + err);
      });
  } catch (error) {
    console.log("Database Connection Failed!");
  }
};

module.exports = connectDB;
