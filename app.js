import bodyParser from "body-parser";
import connectDB from "./database/connectdb.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import userController from "./controllers/userController.js";
import messageController from "./controllers/messageController.js";
import UserModel from "./model/User.js";
import MessageModel from "./model/Message.js";

let sockets = {};

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

app.post("/api/messages", messageController.sendMesage);
app.post("/api/allmessages", messageController.getMessagesBetweenUsers);

io.on("connection", (socket) => {
  socket.on("sendMessage", async (data) => {
    await MessageModel.insertMany([
      { content: data.message, receiver: data.receiver, sender: data.sender },
    ]);

    io.to(data.to).emit("messageReceived", {
      content: data.message,
      receiver: data.receiver,
      sender: data.sender,
    });

    io.to(socket.id).emit("sendMessage", {
      content: data.message,
      receiver: data.receiver,
      sender: data.sender,
    });
  });

  socket.on("save_socket_id", async (data) => {
    sockets[data.userId] = socket.id;
    await UserModel.updateOne(
      { _id: data.userId },
      { $set: { socketId: socket.id } }
    );

    const users = await UserModel.find({}, { password: 0 });

    socket.broadcast.emit("user_updates", { sockets });
  });

  // socket.on("removeSocketId", async (data) => {
  //   await UserModel.updateOne({ _id: data.userId }, { $set: { socketId: "" } });
  // });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
