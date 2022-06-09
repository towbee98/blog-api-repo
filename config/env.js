const dotenv = require("dotenv");
dotenv.config();
// console.log(process.env.NODE_ENV.trim(), 1);
module.exports = {
  MONGO_URI:
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI_LOCAL
      : process.env.MONGO_URI,
  PORT: process.env.PORT,
  ENV: process.env.NODE_ENV,
  TOKEN_PHRASE: process.env.TOKEN_PHRASE,
};
