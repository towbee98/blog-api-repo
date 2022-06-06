const User = require("../models/user");

exports.login = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Route not active yet",
    });
  } catch (error) {
    next(error);
  }
};

exports.SignUp = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Route not active yet",
    });
  } catch (error) {}
};

exports.forgetPassword = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Route not active yet",
    });
  } catch (error) {}
};

exports.getUser = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Route not active yet",
    });
  } catch (error) {}
};

exports.updateUser = (req, res, next) => {
  try {
  } catch (error) {}
};

exports.deleteUser = (req, res, next) => {
  try {
  } catch (error) {}
};

exports.forgetPassword = (req, res, next) => {
  try {
  } catch (error) {}
};
