const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./db/connect');
const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI

const feedbackRouter = require('./routes/feedbackRoutes');
const fileUpload = require("./routes/fileUpload");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', feedbackRouter);
app.use("", fileUpload);


const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
