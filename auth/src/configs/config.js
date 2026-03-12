import dotenv from "dotenv";
dotenv.config();

const _config = {
  PORT: process.env.PORT,
  MONGODB: process.env.MONGODB,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
};

const config = Object.freeze(_config);

export default config;
