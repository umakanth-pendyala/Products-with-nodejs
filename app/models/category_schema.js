const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
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

module.exports = categorySchema;
