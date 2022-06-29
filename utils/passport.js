// const passport= require("passport");
// const config= require("../config/env");
// const GoogleStrategy= require("passport-google-oauth20");
// //const User= require("../models/user");
// const UserRepo= require("../repository/userRepo")


// passport.serializeUser((user,done)=>{
//   done(null,user.id);
// })
// passport.deserializeUser(async(id,done)=>{
//   const user=await UserRepo.findUser({_id:id});
//   done(null,user);
// })
// passport.use(new GoogleStrategy({
//   callbackURL:'/auth/google/callback',
//   clientID:config.CLIENT_ID.trim(),
//   clientSecret:config.CLIENT_SECRET.trim()
// },async(accessToken,refreshToken,profile,done)=>{
//   //callback is fired once the redirect is called
//   //console.log(profile);
//  const user= await UserRepo.findUser({googleId:profile.id});
//  if(!user){
//     const newUser= await UserRepo.CreateUser({name:profile.displayName,googleId:profile.id});
//     console.log("new user created"+ newUser)
//     done(null,newUser)
//  }else{
//     console.log("user already exists"+ user);
//     done(null,user)
//  }
//  // done(err,profile);
// }))