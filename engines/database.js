const mongoose = require("mongoose");
const config = require("../config/env");
const CreateError = require("../utils/ErrorClass");

const ConnectDB = (cb) => {
  try {
    mongoose.connect(
      config.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log("Database connected succesfully");
        cb();
      }
    );
  } catch (error) {
    next(new CreateError(500, error.message));
  }
};

module.exports = ConnectDB;
