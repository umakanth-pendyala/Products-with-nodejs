const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const categorySchema = require("../models/category_schema");

router.get("/list", (req, res) => {
  const Category = mongoose.model("category", categorySchema);
  Category.find({}, (err, data) => {
    if (!err) {
      res.send({
        error: null,
        statusCode: 200,
        body: {
          message: "categoryes fetched",
          data: data,
        },
      });
    } else {
      res.json({
        error: "un-able to fetch categoryes",
        statusCode: 205,
        body: null,
      });
    }
  });
});

router.get("/list_active", (req, res) => {
  const Category = mongoose.model("category", categorySchema);
  Category.find({ status: "active" }, (err, data) => {
    if (!err) {
      res.send({
        error: null,
        statusCode: 200,
        body: {
          message: "categoryes fetched",
          data: data,
        },
      });
    } else {
      res.json({
        error: "un-able to fetch categoryes",
        statusCode: 205,
        body: null,
      });
    }
  });
});

router.post("/add", (req, res) => {
  const Category = mongoose.model("category", categorySchema);
  Category.exists(
    {
      name: req.body.name,
    },
    (err, categoryExists) => {
      if (categoryExists && !err) {
        res.json({
          statusCode: 205,
          error: "category arleady exists.",
        });
      } else if (categoryExists == false) {
        const newCategory = new Category({
          name: req.body.name,
          status: req.body.status,
          image: req.body.image,
        });
        newCategory.save((err) => {
          if (err) {
            errors = [];
            console.log(err);
            if (err.errors != undefined) {
              if (err.errors.name != undefined) {
                errors.push(err.errors.name.message);
              }
              if (err.errors.status != undefined) {
                errors.push(err.errors.status.message);
              }
            }
            res.json({
              statusCode: 205,
              body: null,
              errors: errors,
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
      } else if (err) {
        res.json({
          statusCode: 205,
          error: "enter proper details",
          body: null,
        });
      }
    }
  );
});

router.post("/update", (req, res) => {
  const Category = mongoose.model("category", categorySchema);
  const updatedObject = {
    name: req.body.name,
    image: req.body.image,
    status: req.body.status,
  };
  const errors = [];
  if (updatedObject.name == undefined) {
    errors.push("name must not be null");
  }
  if (
    !(updatedObject.status == "active" || updatedObject.status == "deactive")
  ) {
    errors.push("status must be active | deactive");
  }

  if (errors.length > 0) {
    res.json({
      statusCode: 205,
      error: errors,
    });
  } else {
    Category.find(
      {
        name: req.body.name,
      },
      (err, data) => {
        if (!err) {
          if (data.length > 0) {
            data[0].image =
              updatedObject.image == undefined ? null : updatedObject.image;
            data[0].status =
              updatedObject.status == undefined ? null : updatedObject.status;

            new Category(data[0]).save((err) => {
              if (!err) {
                res.json({
                  error: null,
                  statusCode: 200,
                  body: {
                    message: "update successfull",
                  },
                });
              } else {
                res.json({
                  error: "category update failed",
                  statusCode: 205,
                  body: null,
                });
              }
            });
          } else {
            res.json({
              error: "That category do not exist",
              statusCode: 205,
              body: null,
            });
          }
        } else {
          res.json({
            error: "category update failed",
            statusCode: 205,
            body: null,
          });
        }
      }
    );
  }
});

module.exports = router;
