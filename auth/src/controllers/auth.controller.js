import User from "../models/auth.model.js";
import config from "../configs/config.js";
import redis from "../utils/redis.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName = {}, email, password } = req.body;
    const { firstName, lastName } = fullName;

    if (!firstName || !email || !password) {
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
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        firstName: user.fullName.firstName,
        email: user.email,
      },
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

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Number(config.JWT_EXPIRE) * 1000,
    });

    const { password: _pw, ...userSafe } = user.toObject();

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
      ex: Math.max(Number(config.JWT_EXPIRE) || 3600, 1),
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
    const user = await User.findById(req.user.id);
    return res.status(200).json({ message: "User Profile", user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
