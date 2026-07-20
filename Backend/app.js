require('dotenv').config();

const express = require('express');
const app = express();

const morgan = require('morgan');

// database
const connectDB = require('./db/connect');

const feedbackRouter = require('./routes/feedbackRoutes');


app.use(express.json());

app.use('/api/v1', feedbackRouter)

const port = process.env.PORT || 5000;
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
