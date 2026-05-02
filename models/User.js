const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 256,
      },
      last: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 256,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 256,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;