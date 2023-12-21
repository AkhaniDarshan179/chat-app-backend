import mongoose from "mongoose";
import bcrypt from "bcrypt";

const chatroomSchema = new mongoose.Schema({
  username: { type: String, require: "Username is required!" },
});

const ChatroomModel = mongoose.model("chatroom", chatroomSchema);

export default ChatroomModel;
