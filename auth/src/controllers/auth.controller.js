import User from "../models/auth.model.js";
import config from "../configs/config.js";
import redis from "../utils/redis.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {
      fullName: { firstName, lastName },
      email,
      password,
      role,
      isVerifyEmail,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !role ||
      !isVerifyEmail
    ) {
      return res.status(400).json({ message: "All Data is Required" });
    }

    const isAlreadyExists = await User.findOne({ email });
    if (isAlreadyExists) {
      return res.status(400).json({ message: "Email is Already Exits" });
    }

    const user = await User.create({
      fullName: { firstName, lastName },
      email,
      password,
      role,
      isVerifyEmail,
    });

    return res.status(201).json({ message: "User is Created", user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All Data is Required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Email is not Exits" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE,
    });

    res.cookie(token, {
      httpOnly: true,
      expires: new Date(Date.now() + config.JWT_EXPIRE),
    });

    return res.status(201).json({ message: "Login Successful", user, token });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    await redis.set(`blacklist:${token}`, "true", { ex: 3600 });
    res.clearCookie("token");

    return res.status(200).json({ message: "User is Logout" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({ message: "User Profile", user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
