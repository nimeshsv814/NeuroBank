import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import indexRoute from "./routes/index.route.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

app.use("/api", indexRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
