const User = require("../models/user");
const CreateError = require("../utils/ErrorClass");
const jwt = require("jsonwebtoken");
const config = require("../config/env");


const generateToken = async (email) => {
  return jwt.sign({ email }, config.TOKEN_PHRASE, {
    expiresIn: "4h",
  });
};

exports.login = async (req, res, next) => {
  try {
    //1. Clean the incoming data
    const data = { ...req.body };
    Object.keys(data).forEach((el) => (data[el] = data[el].trim()));
    const { email, password } = data;

    if (!email || !password)
      return next(
        new CreateError(400, "Email and password fields cannot be empty")
      );

    //2.Check if the email exists and password match
    const user = await User.findOne({ email }).select("-__v +password");
    //console.log(user);

    if (!user || !(await user.checkPassword(password, user.password)))
      return next(new CreateError(400, "Email not found or Invalid Password"));

    const token = await generateToken(user.email);

    const cookieOptions = {
      expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
      httpOnly: true,
    };
    if (config.ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    return res.status(200).json({
      status: "success",
      token,
      message: "Logged in succesfully",
    });
  } catch (error) {
    next(error);
  }
};


exports.SignUp = async (req, res, next) => {
  try {
    //1. Get user input and trim it
    const data = { ...req.body };
    Object.keys(data).forEach((el) => (data[el] = data[el].trim()));
    const { name, email, password, passwordConfirm } = data;
    if (!name || !email || !password || !passwordConfirm)
      next(
        new CreateError(
          400,
          "All inputs are required, please enter a valid input"
        )
      );
    //2. Check if the user email already exsit on the db
    if (await User.findOne({ email }))
      next(new CreateError(400, "Email already exists."));
    //4. Store the user to the db

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    user.password = undefined;
    user.passwordConfirm = undefined;
    //5. Create a signed JWT
    // user.token = await generateToken(email);
    res.status(201).json({
      status: "success",
      user,
      message: "Account Created successfully.Please login to continue",
    });
  } catch (error) {
    next(error);
  }
};


exports.forgetPassword = (req, res, next) => {
  try {
    res.status(200).json({
      message: "Route not active yet",
    });
  } catch (error) {
    next(error);
  }
};


exports.getUser =async (req, res, next) => {
  try {
    //console.log(req.user);
    const userID= req.user._id;
    if(!userID) return next(new CreateError(400,"Please login again"));
    const user=await  User.findById(userID).select("-__v")
    if(!user) return next(new CreateError(400,"User not found"));
    res.status(200).json({
      status:"success",
      data:user
    });
  } catch (error) {
    if (error.kind === "ObjectId")
      return next(new CreateError(404, "User not found"));
    return next(new CreateError(400, error.message));
  }
};


exports.updateUser =async (req, res, next) => {
  try {
    const userID=req.user._id;   
    if(!userID) return next(new CreateError(400,"Please login again"));
    
    let {name}= req.body; 
    if(!name) return next(new CreateError(400,"No data to update"))
    name=name.trim();
    const updatedUser= await User.findByIdAndUpdate(userID,{name},{new:true,runValidators:true}).select("-__v")
    res.status(200).json({
      status:"success",
      updatedUser,
      message:"You details have been updated succesfully"
    })
  } catch (error) {
    next(error);
  }
};


exports.deleteUser = async (req, res, next) => {
  try {
    const userID = req.user._id;
    if (!userID) return next(new CreateError(400, "Enter a valid userID"));
    const deletedUser = await User.findByIdAndDelete(userID);
    res.status(204).json({
      status: "success",
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllUsers = async (req, res, next) => {
  //console.log(req.user);
  try {
    const users = await User.find().select("-__v");
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};




