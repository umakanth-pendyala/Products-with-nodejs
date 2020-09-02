const express = require("express");
const userSchema = require("../models/user_schema");
const mongoose = require("mongoose");
var router = express.Router();

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const User = mongoose.model("user", userSchema);
  User.find(
    {
      email: email,
      password: password,
    },
    (err, data) => {
      if (!err && data.length > 0) {
        data[0].lastlogin = Date.now();
        new User(data[0]).save((err) => {
          if (err) {
            res.json({
              statusCode: 205,
              error: err.errors.type.message,
              body: null,
            });
          } else {
            res.json({
              statusCode: 200,
              error: null,
              body: {
                message: "Authentication successfull",
              },
            });
          }
        });
      } else {
        res.json({
          statusCode: 205,
          error: "Authentication failed",
          body: null,
        });
      }
    }
  );
});

module.exports = router;
