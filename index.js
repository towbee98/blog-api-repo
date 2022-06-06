const express = require("express");
const GlobalErrorHandler = require("./controllers/errorHandler");
const CreateError = require("./utils/ErrorClass");
const indexRouter = require("./routes/index");
//const BlogRouter = require("./routes/blog.routes");
const ConnectDB = require("./engines/database");
const config = require("./config/env");
const PORT = config.PORT;
const app = express();

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("Uncaught Exception,Shutting down !!!");
  process.exit(1);
});

app.use(express.json());
app.use("/api/v1", indexRouter);

app.use("/*", (next) => {
  next(new CreateError(404, "Route not found"));
});
app.use(GlobalErrorHandler);

ConnectDB(() => {
  app.listen(PORT, () => {
    console.log("Server running at " + PORT);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err.message);
  console.log("Unhandled Rejection, Shutting down!!!");
  process.exit(1);
});
