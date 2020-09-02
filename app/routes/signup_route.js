const express = require("express");
const userSchema = require("../models/user_schema");
const mongoose = require("mongoose");
var router = express.Router();

router.post("/signup", (req, res) => {
  const User = mongoose.model("user", userSchema);
  User.exists(
    {
      email: req.body.email,
    },
    (err, userExists) => {
      if (userExists) {
        res.json({
          statusCode: 205,
          error: "user arleady exists with this email.",
        });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          bio: req.body.bio,
          image: req.body.image,
          status: req.body.status,
          type: req.body.type,
        });
        newUser.save((err) => {
          if (err) {
            res.json({
              statusCode: 205,
              error:
                err.errors.type == undefined && err.errors.status == undefined
                  ? "Login details are not valid"
                  : err.errors.type == undefined
                  ? err.errors.status.message
                  : err.errors.type.message,
              body: null,
            });
          } else {
            res.json({
              statusCode: 200,
              error: null,
              body: {
                message: "Saved",
              },
            });
          }
        });
      }
    }
  );
});

module.exports = router;
