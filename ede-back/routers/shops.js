const express = require('express')
const router = express.Router()
const {uploadShopImage} = require("../midleware/shops")
const {saveNewShop, getPositions, getProducts, getShopCategories, getShopImage} = require("../controllers/shops")

router.post("/positions",(req, res)=>{
  getPositions(req, res)
})

router.post("/products", (req, res)=>{
  getProducts(req, res)
})

router.post("/get_categories",(req, res)=>{
  getShopCategories(req, res);
})

router.post("/get_image",(req, res)=>{
  getShopImage(req, res);
})

router.post("/save",  uploadShopImage.single("shop_picture"), (req, res) => {
    saveNewShop(req).then(response => {
      res.json({successfull: response.successfull, shop_id:response.id})});
});

module.exports = router