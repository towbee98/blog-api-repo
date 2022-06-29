const { promisify } = require("util");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const CreateError = require("../utils/ErrorClass");
const config = require("../config/env");

exports.protect = async (req, res, next) => {
  try {
    //1.)Check if the token exists in the request
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token)
      return next(
        new CreateError(
          401,
          "You are not logged in , Please log in to access this route"
        )
      );
    //2.) Verify Token
    const verifiedToken = await promisify(jwt.verify)(
      token,
      config.TOKEN_PHRASE
    );

    //3.) Check if the user with the token still exists
    const validUser = await User.findOne({ email: verifiedToken.email });

    if (!validUser)
      return next(new CreateError(401, "Access denied or user not found"));

    //4.) Check if the password was changed after the token was issued
    if (await validUser.changedPasswordAfterToken(verifiedToken.iat))
      return next(
        new CreateError(401, "Password has been changed ,Login again")
      );
    req.user = validUser;
    next();
  } catch (error) {
    return next(error);
  }
};
