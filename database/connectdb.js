import mongoose from "mongoose";

const connectDB = async (DATABASE_URI) => {
  try {
    const DB_OPTION = {
      dbname: "chatbox",
    };
    await mongoose.connect(DATABASE_URI, DB_OPTION);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
