import jwt from "jsonwebtoken";
import config from "../configs/config.js";
import redis from "../utils/redis.js";

export const authMiddleware = async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.split(" ")[1];
  const token = cookieToken || headerToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(403).json({ message: "Token is blacklisted" });
    }
  } catch (error) {
    console.error("Redis Error in authMiddleware:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during authentication check" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};

export const systemUserMiddleware = async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.split(" ")[1];
  const token = cookieToken || headerToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(403).json({ message: "Token is blacklisted" });
    }
  } catch (error) {
    console.error("Redis Error in authMiddleware:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during authentication check" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (!decoded.systemUser) {
      return res.status(403).json({
        message: `${decoded.fullName.firstName} is not a system user`,
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};
