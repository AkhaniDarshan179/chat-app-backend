import UserModel from "../model/User.js";
import MessageModel from "../model/Message.js";

const sendMesage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    const senderExists = await UserModel.exists({ username: sender });
    const receiverExists = await UserModel.exists({ username: receiver });

    if (!senderExists || !receiverExists) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    const message = new MessageModel({
      sender,
      receiver,
      content,
    });

    await message.save();
    res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    const messages = await MessageModel.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.json({ data: messages });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  sendMesage,
  getMessagesBetweenUsers,
};
