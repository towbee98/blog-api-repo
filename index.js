const express = require("express");
const GlobalErrorHandler = require("./services/errorHandler");
const CreateError = require("./utils/ErrorClass");
const indexRouter = require("./routes/index");
//const BlogRouter = require("./routes/blog.routes");
const ConnectDB = require("./engines/database");
const config = require("./config/env");
const PORT = config.PORT;
const app = express();

app.use(express.json());
app.use("/api/v1", indexRouter);

app.use("/*", (req, res, next) => {
  next(new CreateError(404, "Route not found"));
});
app.use(GlobalErrorHandler);

ConnectDB(() => {
  app.listen(PORT, () => {
    console.log("Server running at " + PORT);
  });
});
