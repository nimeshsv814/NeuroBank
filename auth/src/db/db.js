import mongoose from "mongoose";
import config from "../configs/config.js";

const connectDB = () => {
  mongoose
    .connect(config.MONGODB)
    .then(() => console.log("MongoDB is Connected"))
    .catch((err) => console.log(err));
};

export default connectDB;
