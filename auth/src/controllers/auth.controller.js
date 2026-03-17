import User from "../models/auth.model.js";
import config from "../configs/config.js";
import redis from "../utils/redis.js";
import generateToken from "../utils/generateToken.js";
import { publishToQueue } from "../broker/rabbit.js";
import { parseExpToMs, parseExpToSec } from "../utils/parse.js";

export const register = async (req, res) => {
  try {
    const { fullName = {}, email, password } = req.body;
    const { firstName, lastName } = fullName;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Required data missing" });
    }

    const isAlreadyExists = await User.findOne({ email });

    if (isAlreadyExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      fullName: { firstName, lastName },
      email,
      password,
      role: "user",
      isVerifyEmail: false,
      systemUser: false,
    });

    return res.status(201).json({
      message: "User created",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Required data missing" });
    }

    const user = await User.findOne({ email }).select("+password +systemUser");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: parseExpToMs(config.JWT_EXPIRE),
    });

    const { password: _pw, ...userSafe } = user.toObject();

    publishToQueue("user.login", userSafe);

    return res
      .status(200)
      .json({ message: "Login Successful", user: userSafe, token });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.headers.authorization?.split(" ")[1];
    const token = cookieToken || headerToken;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    await redis.set(`blacklist:${token}`, "true", {
      ex: Math.max(parseExpToSec(config.JWT_EXPIRE), 1),
    });
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({ message: "User is Logout" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+systemUser");
    return res.status(200).json({ message: "User Profile", user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
