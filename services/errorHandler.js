const config = require("../config/env");
const GlobalErrorhandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (config.ENV === "production") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      error: err,
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }
};

module.exports = GlobalErrorhandler;
