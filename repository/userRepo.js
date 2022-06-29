const User= require("../models/user")

exports.findUser= async(param)=>{
   return  await User.findOne(param).select("-__v +password");
}

exports.CreateUser= async ({name,email,password,passwordConfirm,googleId})=>{
       return  await User.create({name,email,password,passwordConfirm,googleId});
}

exports.GetUser=async (userID)=>{
    return await User.findById(userID).select("-__v")
}

exports.UpdateUser= async (userID,name)=>{
    return await User.findByIdAndUpdate(userID,{name},{new:true,runValidators:true}).select("-__v")
}

exports.deleteUser= async (userID)=>{
    return await User.findByIdAndDelete(userID);
}

exports.getAllUsers=async ()=>{
   return  await User.find().select("-__v");
}