const express = require('express')
const router = express.Router()
const {getPurchases} = require("../controllers/purchases")

router.post("/get_data", (req, res)=>{
  getPurchases(req, res);
})

module.exports = router