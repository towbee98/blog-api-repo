const { google } = require("googleapis");
const config = require("../config/env");
const axios = require("axios").default;
// const UserRepo= require("../repository/userRepo")

const oauth2Client = new google.auth.OAuth2(
  config.CLIENT_ID,
  config.CLIENT_SECRET,
  "http://localhost:3400/auth/google/callback"
);

exports.getGoogleAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

exports.getGoogleUser = async ({ code }) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    //console.log(tokens);
    //Fetch the user profile with the access token and bearer
    const googleUser = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      }
    );
    //console.log(googleUser)
    return googleUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

// exports.googleAuth= async(input)=>{
//     try {
//     const googleUser=await getGoogleUser({code:input})
//     // console.log(googleUser.data.id);
//     let user = await UserRepo.findUser({googleId:googleUser.data.id});
//     return user
//     } catch (error) {
//         throw new Error(error.message)
//     }

// }
