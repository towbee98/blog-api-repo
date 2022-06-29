const dotenv = require("dotenv");
dotenv.config();
// console.log(process.env.NODE_ENV.trim(), 1);
module.exports = {
  MONGO_URI:
    //  process.env.NODE_ENV === "development"
    //    ? process.env.MONGO_URI_LOCAL:
    process.env.MONGO_URI_LOCAL,
  PORT: process.env.PORT,
  ENV: process.env.NODE_ENV,
  TOKEN_PHRASE: process.env.TOKEN_PHRASE,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  SESSION_KEY: process.env.SESSION_KEY,
  REDIS_URI_LOCAL: process.env.REDIS_URI_LOCAL,
};
