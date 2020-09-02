const mongoose = require("mongoose");
const express = require("express");
const productSchema = require("../models/product_schema");
const userSchema = require("../models/user_schema");
const brandSchema = require("../models/brands_schema");
const categorySchema = require("../models/category_schema");

const router = express.Router();

router.get("/list", (req, res) => {
  const Product = mongoose.model("product", productSchema);
  Product.find({}, (err, data) => {
    if (!err) {
      res.send({
        error: null,
        statusCode: 200,
        body: {
          message: "products fetched",
          data: data,
        },
      });
    } else {
      res.json({
        error: "un-able to fetch products",
        statusCode: 205,
        body: null,
      });
    }
  });
});

router.get("/list_active", (req, res) => {
  const Product = mongoose.model("product", productSchema);
  Product.find({ status: "active" }, (err, data) => {
    if (!err) {
      res.send({
        error: null,
        statusCode: 200,
        body: {
          message: "products fetched (active)",
          data: data,
        },
      });
    } else {
      res.json({
        error: "un-able to fetch products",
        statusCode: 205,
        body: null,
      });
    }
  });
});

router.post("/add", async (req, res) => {
  const Product = mongoose.model("product", productSchema);

  errors = [];
  var quantity = parseInt(req.body.quantity);
  if (
    req.body.name == undefined ||
    req.body.price == undefined ||
    req.body.quantity == undefined ||
    req.body.user_email == undefined ||
    req.body.brand == undefined ||
    req.body.status == undefined ||
    req.body.category == undefined
  ) {
    errors.push("All fields must be filled.");
  }
  if (parseInt(req.body.price) <= 0) {
    errors.push("price should be greater than 0.");
  }
  if (quantity <= 0) {
    errors.push("quantity should be atleast 1");
  }
  if (!(req.body.status == "active" || req.body.status == "deactive")) {
    errors.push("type allowed is active or de-active");
  }

  if (errors.length > 0) {
    res.json({
      error: errors,
      statusCode: 205,
      body: null,
    });
  } else {
    errors = await checkProduct(
      req.body.user_email,
      req.body.brand,
      req.body.category,
      req.body.name
    );
    if (errors.length > 0) {
      res.json({
        error: errors,
        statusCode: 205,
        body: null,
      });
    } else {
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        user_email: req.body.user_email,
        brand: req.body.brand,
        category: req.body.category,
        status: req.body.status,
      });
      product.save((err) => {
        if (!err) {
          res.json({
            error: null,
            statusCode: 200,
            body: {
              message: "product saved",
            },
          });
        }
      });
    }
  }
});

router.post("/update_product", async (req, res) => {
  const Product = mongoose.model("product", productSchema);
  var errors = [];
  var updatedObject = {
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    user_email: req.body.user_email,
    brand: req.body.brand,
    status: req.body.status,
    category: req.body.category,
  };

  if (parseInt(req.body.price) <= 0) {
    errors.push("price should be greater than 0.");
  }
  if (parseInt(req.body.quantity) <= 0) {
    errors.push("quantity should be atleast 1");
  }
  if (!(req.body.status == "active" || req.body.status == "deactive")) {
    errors.push("type allowed is active or de-active");
  }

  if (errors.length > 0) {
    res.json({
      error: errors,
      statusCode: 205,
      body: null,
    });
  } else {
    errors = await checkProduct(
      req.body.user_email,
      req.body.brand,
      req.body.category,
      req.body.name
    );
    console.log(errors);
    if (
      errors.length > 0 &&
      errors.length < 2 &&
      errors[0] == "the product arleady exists"
    ) {
      Product.find(
        {
          name: req.body.name,
          user_email: req.body.user_email,
        },
        (err, data) => {
          if (!err && data.length > 0) {
            data[0].name =
              updatedObject.name == undefined
                ? data[0].name
                : updatedObject.name;
            data[0].price =
              updatedObject.price == undefined
                ? data[0].price
                : updatedObject.price;
            data[0].quantity =
              updatedObject.quantity == undefined
                ? data[0].quantity
                : updatedObject.quantity;
            data[0].user_email =
              updatedObject.user_email == undefined
                ? data[0].user_email
                : updatedObject.user_email;
            data[0].brand =
              updatedObject.brand == undefined
                ? data[0].brand
                : updatedObject.brand;
            data[0].category =
              updatedObject.category == undefined
                ? data[0].category
                : updatedObject.category;
            data[0].status =
              updatedObject.status == undefined
                ? data[0].status
                : updatedObject.status;

            new Product(data[0]).save((err) => {
              if (!err) {
                res.json({
                  error: null,
                  body: {
                    message: "update successfull",
                  },
                  statusCode: 200,
                });
              } else {
                res.json({
                  error: "update failed",
                  body: null,
                  statusCode: 205,
                });
              }
            });
          } else if (data.length == 0) {
            res.json({
              error: "product update failed",
              statusCode: 205,
              body: null,
            });
          }
        }
      );
    } else {
      if (errors.length == 0) errors.push("please enter the name field");
      res.json({
        error: errors,
        body: null,
        statusCode: 205,
      });
    }
  }
});

router.post("/delete", (req, res) => {
  const Product = mongoose.model("product", productSchema);

  Product.exists(
    {
      name: req.body.name,
      user_email: req.body.user_email,
    },
    (err, productExists) => {
      console.log(err, productExists);
      if (productExists) {
        Product.deleteOne(
          {
            name: req.body.name,
            user_email: req.body.user_email,
          },
          (err) => {
            if (!err) {
              res.json({
                error: null,
                body: {
                  message: "product deleted",
                },
                statusCode: 200,
              });
            } else {
              res.json({
                error: "product deletion failed",
                body: null,
                statusCode: 205,
              });
            }
          }
        );
      } else {
        res.json({
          error: "product do not exist | email is in-correct.",
          statusCode: 205,
          body: null,
        });
      }
    }
  );
});

router.post("/status", (req, res) => {
  const Product = mongoose.model("product", productSchema);

  const updatedStatus = req.body.status;

  if (req.body.status == "active" || req.body.status == "deactive") {
    Product.find(
      {
        name: req.body.name,
        user_email: req.body.user_email,
      },
      (err, data) => {
        if (!err && data.length > 0) {
          console.log(data);
          if (data[0].status == updatedStatus) {
            res.json({
              error: null,
              statusCode: 200,
              body: {
                message: "product is arleady in " + updatedStatus + " status",
              },
            });
          } else {
            data[0].status = updatedStatus;
            new Product(data[0]).save((err) => {
              if (!err) {
                res.json({
                  error: null,
                  body: {
                    message: "status changed to " + updatedStatus,
                  },
                  statusCode: 200,
                });
              } else {
                res.json({
                  error: "status change failed",
                  body: null,
                  statusCode: 205,
                });
              }
            });
          }
        } else {
          res.json({
            error: "product do not exist",
            statusCode: 200,
            body: null,
          });
        }
      }
    );
  } else {
    res.json({
      error: "type must be active | deactive",
      statusCode: 200,
      body: null,
    });
  }
});

router.post("/list", (req, res) => {
  const Product = mongoose.model("product", productSchema);
  if (req.body.name == undefined) {
    res.json({
      error: "name should not be empty.",
      body: null,
      statusCode: 205,
    });
  } else {
    Product.find(
      {
        name: req.body.name,
      },
      (err, data) => {
        if (!err && data.length > 0) {
          res.json({
            error: null,
            statusCode: 200,
            body: {
              message: "search item found",
              data: data[0],
            },
          });
        } else {
          res.json({
            error: "item not found",
            statusCode: 200,
            body: null,
          });
        }
      }
    );
  }
});

const checkProduct = async (
  userEmail,
  brandName,
  categoryName,
  productName
) => {
  errors = [];
  const User = mongoose.model("user", userSchema);
  const Brand = mongoose.model("brand", brandSchema);
  const Category = mongoose.model("category", categorySchema);
  const Product = mongoose.model("product", productSchema);
  const userExists = await User.exists({
    email: userEmail,
    status: "active",
    type: "vendor",
  });
  const brandExists = await Brand.exists({
    name: brandName,
  });
  const categoryExists = await Category.exists({
    name: categoryName,
  });
  const productExists = await Product.exists({
    name: productName,
    user_email: userEmail,
  });

  if (!userExists) {
    errors.push("the email do not exist | or user is deactivated");
  }
  if (!brandExists) {
    errors.push("brand do not exist");
  }
  if (!categoryExists) {
    errors.push("category do not exist");
  }
  if (productExists) {
    errors.push("the product arleady exists");
  }

  return errors;
};

module.exports = router;
