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
      return res.status(409).json({
        success: false,
        message: "User not found!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, isUser.password);

    if (!passwordMatch) {
      return res.status(404).json({
        message: "Invalid Password",
      });
    }

    const tokens = GenerateTokens(isUser);
    const { accessToken, refreshToken } = tokens;

    return res.status(200).json({
      message: "Log In successfully.",
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      errorMessage: error.message, 
    });
  }
};


const getUsers = async (req, res) => {
  try {
    const response = await UserModel.find();

    res.status(200).json({
      success: true,
      message: "Done",
      data: response,
    });
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
  getUsers,
};
