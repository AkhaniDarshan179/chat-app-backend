import bcrypt from "bcrypt";
import GenerateTokens from "../utils/tokens.js";
import UserModel from "../model/User.js";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new UserModel({ username, email, password });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User create successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      errorMessage: error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const isUser = await UserModel.findOne({ username });

    if (!isUser) {
      res.status(409).json({
        success: false,
        message: "User not found!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, isUser.password);

    if (!passwordMatch) {
      res.status(404).json({
        message: "Invalid Password",
      });
    } else {
      const tokens = GenerateTokens(isUser);
      const { accessToken, refreshToken } = tokens;

      res.status(200).json({
        message: "Log In successfully.",
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      errorMessage: error,
    });
  }
};

export default {
  register,
  login,
};
