import { mongoConnection } from "./config/index.js";
import { logger } from "./utils/logger/index.js";
import app from "./app.js";

const PORT = process.env.PORT;

const mongoAndServer = () => {
  mongoConnection();
  app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
};
mongoAndServer();

// error handling
process.on("uncaughtException", (err) => {
  if (err) {
    console.log(`Uncaught exception: ${err}`);
  }

  process.exit(1);
});

process.on("unhandledRejection", (ression, __) => {
  console.log(`Unhandled rejection: ${ression}`);
});

app.use((err, __, res, next) => {
  if (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  } else {
    return next();
  }
});
