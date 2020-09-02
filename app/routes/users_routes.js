const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../models/user_schema");

router.get("/all_users", (req, res) => {
  const User = mongoose.model("user", userSchema);
  User.find({}, (err, data) => {
    if (!err) {
      res.json({
        statusCode: 200,
        error: null,
        body: {
          message: "Data retreving successfull",
          data,
        },
      });
    } else {
      res.json({
        statusCode: 205,
        error: err,
        body: null,
      });
    }
  });
});

router.post("/delete", (req, res) => {
  const User = mongoose.model("user", userSchema);
  const email = req.body.email;
  User.find(
    {
      email: email,
    },
    (err, data) => {
      if (!err && data.length != 0) {
        User.deleteOne(
          {
            email: email,
          },
          (err) => {
            if (!err) {
              res.json({
                error: null,
                body: {
                  message: "deletion successfull",
                },
                statusCode: 200,
              });
            } else {
              res.json({
                error: "Deletion failed",
                body: null,
                statusCode: 205,
              });
            }
          }
        );
      } else if (err) {
        res.json({
          error: "Deletion failed",
          body: null,
          statusCode: 205,
        });
      } else if (data.length == 0) {
        res.json({
          error: null,
          body: {
            message: "email do not exist",
          },
          statusCode: 200,
        });
      }
    }
  );
});

router.post("/update_user", (req, res) => {
  const User = mongoose.model("user", userSchema);
  var updatedObject = {
    current_email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    status: req.body.status,
    bio: req.body.bio,
    type: req.body.type,
  };

  // console.log(updatedObject);
  User.find(
    {
      email: req.body.email,
    },
    (err, data) => {
      // updating data object
      if (!err && data.length != 0) {
        error = [];
        (data[0].name =
          updatedObject.name == undefined ? data[0].name : updatedObject.name),
          (data[0].email =
            updatedObject.current_email == undefined
              ? data[0].email
              : updatedObject.current_email),
          (data[0].password =
            updatedObject.password == undefined
              ? data[0].password
              : updatedObject.password),
          (data[0].status =
            updatedObject.status == undefined
              ? data[0].status
              : updatedObject.status),
          (data[0].bio =
            updatedObject.bio == undefined ? data[0].bio : updatedObject.bio),
          (data[0].type =
            updatedObject.type == undefined
              ? data[0].type
              : updatedObject.type);
        console.log(data[0]);
        if (
          !(
            data[0].type == "admin" ||
            data[0].type == "vendor" ||
            data[0].type == "user"
          )
        ) {
          error.push("type should be admin | vendor | user");
        }
        if (!(data[0].status == "active" || data[0].status == "deactive")) {
          console.log("im in active field");
          error.push("status should be active | deactive");
        }

        new User(data[0]).save((err) => {
          if (err) {
            res.json({
              statusCode: 205,
              error: error,
              body: null,
            });
          } else {
            res.json({
              statusCode: 200,
              error: null,
              body: {
                message: "update successfull",
              },
            });
          }
        });
      } else {
        res.json({
          statusCode: 200,
          error: "email do not exist",
          body: null,
        });
      }
    }
  );
});

router.post("/activate", (req, res) => {
  const User = mongoose.model("user", userSchema);
  User.find(
    {
      email: req.body.email,
    },
    (err, data) => {
      if (!err) {
        if (data.length != 0) {
          if (data[0].status == "active") {
            res.json({
              error: null,
              statusCode: 200,
              body: {
                message: "the user is arleady in active state",
              },
            });
          } else {
            data[0].status = "active";
            new User(data[0]).save((err) => {
              if (!err) {
                res.json({
                  error: null,
                  statusCode: 200,
                  body: {
                    message: "the user has been activated",
                  },
                });
              } else {
                res.json({
                  error: null,
                  statusCode: 205,
                  body: {
                    message: "the state should be active | deactive",
                  },
                });
              }
            });
          }
        } else {
          res.json({
            error: null,
            statusCode: 200,
            body: {
              message: "the respective email do not exist",
            },
          });
        }
      } else {
        res.json({
          error: "user activation failed",
          statusCode: 205,
          body: null,
        });
      }
    }
  );
});

router.post("/deactivate", (req, res) => {
  const User = mongoose.model("user", userSchema);
  User.find(
    {
      email: req.body.email,
    },
    (err, data) => {
      if (!err) {
        if (data.length != 0) {
          if (data[0].status == "deactive") {
            res.json({
              error: null,
              statusCode: 200,
              body: {
                message: "the user is arleady in de-active state",
              },
            });
          } else {
            data[0].status = "deactive";
            new User(data[0]).save((err) => {
              if (!err) {
                res.json({
                  error: null,
                  statusCode: 200,
                  body: {
                    message: "the user has been deactivated",
                  },
                });
              } else {
                res.json({
                  error: null,
                  statusCode: 200,
                  body: {
                    message: "the status must be either active | deactive",
                  },
                });
              }
            });
          }
        } else {
          res.json({
            error: null,
            statusCode: 200,
            body: {
              message: "the respective email do not exist",
            },
          });
        }
      } else {
        res.json({
          error: "user activation failed",
          statusCode: 205,
          body: null,
        });
      }
    }
  );
});

module.exports = router;
