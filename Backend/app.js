const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const morgan = require("morgan");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/connect");
const authRouter = require("./routes/authRoute");
const feedbackRouter = require("./routes/feedbackRoutes");
const fileUploadRouter = require("./routes/fileUploadRoutes");
const jobRouter = require("./routes/jobRoutes");
const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// --------------------
// Express middleware
// --------------------

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// --------------------
// Routes
// --------------------

app.use("/api/v1", feedbackRouter);
app.use("", fileUploadRouter);
app.use("", authRouter);
app.use("",jobRouter);

// --------------------
// HTTP Server
// --------------------

const server = http.createServer(app);


// --------------------
// Socket.IO
// --------------------

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-shop", (shopId) => {
    socket.join(`shop-${shopId}`);

    console.log(
      `Socket ${socket.id} joined shop-${shopId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// --------------------
// Start server
// --------------------

const start = async () => {
  try {
    await connectDB(MONGO_URI);

    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });

  } catch (error) {
    console.log(error);
  }
};

start();