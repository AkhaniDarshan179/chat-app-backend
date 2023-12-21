import mongoose from "mongoose";
import bcrypt from "bcrypt";

const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    require: "Chatroom is required!",
    ref: "Chatroom",
  },
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    require: "User is required!",
    ref: "User",
  },
  message: {
    type: String,
    require: "Message is required!",
  },
});

const MessageModel = mongoose.model("message", messageSchema);

export default MessageModel;
