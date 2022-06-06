const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name cannot be empty"],
  },
  email: {
    type: String,
    required: [true, "email cannot be empty"],
    unique: [true, "Email already exist"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty"],
    minlength: [7, "Password must be at least 7 characters"],
    maxlength: [12, "Password must not be more than 12 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password cannot be empty"],
    minlength: [7, "Password must be at least 7 characters"],
    maxlength: [12, "Password must not be more than 12 characters"],
    select: false,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Password must match PasswordConfirm",
    },
  },
});



const User = mongoose.model("Users", UserSchema);

module.exports = User;
