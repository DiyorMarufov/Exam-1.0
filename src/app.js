import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import fs from "fs";
import path from "path";

import { mainRouter } from "./router/index.js";

config();
const app = express();

// morgan
const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
  flags: "a",
});

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/course", mainRouter);

export default app;
