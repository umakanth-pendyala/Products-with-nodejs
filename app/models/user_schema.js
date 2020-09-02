const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: {
      values: ["admin", "vendor", "user"],
      message: "Valid types are admin | vendor | user.",
    },
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["active", "deactive"],
      message: "valid types are active | deactive.",
    },
    required: true,
  },
  lastlogin: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = userSchema;
