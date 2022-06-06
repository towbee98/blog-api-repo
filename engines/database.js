const mongoose = require("mongoose");
const config = require("../config/env");
//const CreateError = require("../utils/ErrorClass");
const ConnectDB = async (cb) => {
  try {
    await mongoose.connect(`${config.MONGO_URI}`);
    console.log("Database connected succesfully");
    cb();
  } catch (error) {
    console.log(error);
  }
};

module.exports = ConnectDB;
