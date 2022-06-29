const express = require("express");
const path = require("path");
const pug = require("pug");
// const passport= require("passport")
// const cookieSession= require("cookie-session");
const GlobalErrorHandler = require("./controllers/errorHandler");
const CreateError = require("./utils/ErrorClass");
const indexRouter = require("./routes/index");
const viewRouter = require("./routes/view.routes");
const ConnectDB = require("./engines/database");
const config = require("./config/env");
const PORT = config.PORT;
const app = express();

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("Uncaught Exception,Shutting down !!!");
  process.exit(1);
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());

app.use("/api/v1", indexRouter);
app.use("/", viewRouter);

app.all("*", (next) => {
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
