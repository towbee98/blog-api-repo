const config = require("../config/env");
const CreateError = require("../utils/ErrorClass");

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new CreateError(400, message);
};

const handleJwtError = (err) => {
  //if (err.name === "TokenExpiredError")
  return new CreateError(401, `Invalid Token, Please login again`);
};
const handleDuplicateError = (err) => {
  const extractedDuplicateValue = err.message.match(
    /(?<=(["']\b))(?:(?=(\\?))\2.)*?(?=\1)/g
  )[0];
  //console.log(extractedDuplicateValue);
  return new CreateError(
    400,
    `\'${extractedDuplicateValue}\' already exists . Try using another value.`
  );
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data: ${errors.join(" and ")}`;
  return new CreateError(400, message);
};

const GlobalErrorhandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  //console.log(err.name);
  if (config.ENV.trim() === "production") {
    if (err.code === 11000) {
      err = handleDuplicateError(err);
    }
    if (err.name === "CastError") {
      err = handleCastError(err);
    }
    if (err.name === "ValidationError") {
      err = handleValidationError(err);
    }
    if (err.name === "JsonWebTokenError" || err.name === "TypeError") {
      err = handleJwtError(err);
    }
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.log(err.statusCode);
    res.status(err.statusCode).json({
      error: err,
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }
};

module.exports = GlobalErrorhandler;
