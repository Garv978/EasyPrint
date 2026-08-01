const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./db/connect');
const port = process.env.PORT || 5000;

const feedbackRouter = require('./routes/feedbackRoutes');
const fileUpload = require("./routes/fileUpload");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', feedbackRouter);
app.use("", fileUpload);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
