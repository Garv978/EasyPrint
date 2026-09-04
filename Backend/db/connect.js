const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.info("connected to DB"))
    .catch((error) => {
      console.error("Database connection failed:", error);
      throw error;
    });
};

module.exports = connectDB;