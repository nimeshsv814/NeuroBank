import dotenv from "dotenv";
dotenv.config();

const _config = {
  PORT: process.env.PORT,
  MONGODB: process.env.MONGODB,
};

const config = Object.freeze(_config);

export default config;
