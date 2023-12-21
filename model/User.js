import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, require: "Username is required!" },
  email: { type: String, require: "Email is required!" },
  password: { type: String, require: "Password is required!" },
});

userSchema.pre("save", async function (next) {
  const user = this;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
