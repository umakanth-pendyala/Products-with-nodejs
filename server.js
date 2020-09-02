const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const loginRoute = require("./app/routes/login_route");
const signupRoute = require("./app/routes/signup_route");
const userRoutes = require("./app/routes/users_routes");
const brandRoutes = require("./app/routes/brands_routes");
const categoryRoutes = require("./app/routes/cate_routes");
const productRoutes = require("./app/routes/product_routes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb://localhost:27017/demo",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("connected");
    else console.log("connection failed", err.message.toString());
  }
);

app.use("/users", signupRoute);
app.use("/users", loginRoute);
app.use("/users", userRoutes);

app.use("/brands", brandRoutes);
app.use("/category", categoryRoutes);

app.use("/product", productRoutes);

app.listen(3000, () => console.log("port listening on 3000"));
