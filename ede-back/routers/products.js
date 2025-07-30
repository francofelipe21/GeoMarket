const express = require('express')
const router = express.Router()
const {upload_product} = require("../midleware/products");
const {saveProduct, getSubcategories, getCategories} = require("../controllers/products")

router.post("/save", upload_product.single("product_picture"), (req, res)=>{saveProduct(req, res)})

router.post("/subcategories",(req, res)=>{
  getSubcategories(req,res);
})

router.post("/categories",(req, res)=>{getCategories(req, res)})

module.exports = router