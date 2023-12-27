import bodyParser from "body-parser";
import connectDB from "./database/connectdb.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import userController from "./controllers/userController.js";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 8000;
const DATABASE_URI = "mongodb://127.0.0.1:27017";

connectDB(DATABASE_URI);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello its working");
});

app.post("/api/register", userController.register);
app.post("/api/login", userController.login);
app.get("/api/users", userController.getUsers);

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", (data) => {

    // console.log("data", data);
  });

  socket.on("message", (data) => {
    console.log("MESSAGE");
    console.log('data', data);

  })

  socket.on("disconnect", () => {
    // console.log("Socket disconnected on the backend!");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
