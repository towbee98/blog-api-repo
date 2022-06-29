const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name cannot be empty"],
  },
  googleId:{
    type:String,
    unique:[true,"User already exist"]
  },
  email: {
    type: String,
    // required: [true, "email cannot be empty"],
    unique: [true, "Email already exist"],
    // validate: {
    //   validator: (value) => validator.isEmail(`${value}`),
    //   message: "Please enter a valid email",
    // },
  },
  password: {
    type: String,
    // required: [true, "Password cannot be empty"],
    // minlength: [7, "Password must be at least 7 characters"],
    // maxlength: [12, "Password must not be more than 12 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    // required: [true, "Password cannot be empty"],
    // minlength: [7, "Password must be at least 7 characters"],
    // maxlength: [12, "Password must not be more than 12 characters"],
    select: false,
    // validate: {
    //   validator: function (value) {
    //     return value === this.password;
    //   },
    //   message: "Password must match PasswordConfirm",
    // },
  },
  token: {
    type: String,
  },
  passwordChangedAt: Date,
});


UserSchema.pre("save", async function (next) {
  //Check if password was modified
  if (!this.isModified("password") || this.password===undefined) return next();
  //encrypt the password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});


UserSchema.pre("save", async function (next) {
  // Check if password was modified
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  //console.log(this.passwordChangedAt);
  next();
});

//This method checks if the password is valid.
UserSchema.methods.checkPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};


//This method check if the password was recently changed after JWT was issued.
//It returns true if password was changed after jwt was issued, else it returns false
UserSchema.methods.changedPasswordAfterToken = async (JwtTimeStamp) => {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt);
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JwtTimeStamp < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model("Users", UserSchema);

module.exports = User;
