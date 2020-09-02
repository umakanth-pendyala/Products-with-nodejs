const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var brandSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: {
      values: ["active", "deactive"],
      message: "valid types are active | deactive",
    },
    required: true,
  },
});

module.exports = brandSchema;
