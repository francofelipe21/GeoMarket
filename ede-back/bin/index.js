const express = require("express");
var cors = require('cors');
const fs = require('fs');
const bodyParser = require("body-parser");
const {PORT} = require("../config/development.js");
const {initializeDDBB} = require("../models/ddbb_initialization.js")

const user_router = require("../routers/users.js")
const products_router = require("../routers/products.js")
const shops_router = require("../routers/shops")
const sales_router = require("../routers/sales")
const purchases_router = require("../routers/purchases")

const app = express();
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use("/users", user_router)
app.use("/products", products_router)
app.use("/shops", shops_router)
app.use("/sales", sales_router)
app.use("/purchases", purchases_router)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  initializeDDBB();
});
