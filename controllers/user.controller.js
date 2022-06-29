const User = require("../models/user");
const UserRepo= require("../repository/userRepo")
const CreateError = require("../utils/ErrorClass");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const Validators= require("../validators/user")
const Oauth= require("../utils/oauth")


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
    const { email , password } = data;
    if (!email || !password)
      return next(
        new CreateError(400, "Email and password fields cannot be empty")
      );
    //Validates userCredetials
    const validatedUser=await Validators.validateLogin({email,password});
    //console.log(validatedUser)
    //2.Check if the email exists and password match
    const user = await UserRepo.findUser({email:validatedUser.email})
    //console.log(user);

    if (!user || !(await user.checkPassword(validatedUser.password, user.password)))
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

exports.getGoogleUrl= async(req,res)=>{
  try {
   res.send(Oauth.getGoogleAuthUrl());
  } catch (error) {
    return error
  }
}

exports.handleRedirect=async (req,res)=>{
  try {
    const code= req.query.code;
   let googleUser=  await Oauth.getGoogleUser({code});
   console.log(googleUser.data)
   //Check if the user exists
    let user=await UserRepo.findUser({googleId:googleUser.data.id,email:googleUser.data.email});
    console.log(user)
    if(!user){
        user= await UserRepo.CreateUser({name:googleUser.data.name,email:googleUser.data.email,googleId:googleUser.data.id})
    }
        const token = await generateToken(user.email);
        const cookieOptions = {
          expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
          httpOnly: true,
        };
        if (config.ENV === "production") cookieOptions.secure = true;

       res.cookie("jwt", token, cookieOptions);
         res.status(200).json({
          status: "success",
          token,
          message: "Logged in succesfully",
        });
  } catch (error) {
    return error
  }
}


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
    if (await UserRepo.findUser({ email }))
      next(new CreateError(400, "Email already exists."));

    //3. Validates the user 
    const validatedUser= await Validators.validateCreate({name,email,password,passwordConfirm})

    //4. Store the user to the db

    const user = await UserRepo.CreateUser(validatedUser)

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
    const user=await  UserRepo.GetUser(userID)
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
    const updatedUser= await UserRepo.UpdateUser(userID,name);
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
    const deletedUser = await UserRepo.deleteUser(userID)
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
    const users = await UserRepo.getAllUsers()
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};




