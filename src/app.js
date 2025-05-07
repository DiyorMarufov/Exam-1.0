import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

import { mainRouter } from "./router/index.js";

config();
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use("/course", mainRouter);

export default app;
