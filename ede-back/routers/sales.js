const express = require('express')
const router = express.Router()
const {saveSale, getSales} = require("../controllers/sales")

router.post("/save", (req, res)=>{
  saveSale(req, res)
})

router.post("/get_data", (req, res)=>{
  getSales(req, res)
})

module.exports = router