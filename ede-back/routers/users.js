const express = require('express')
const router = express.Router()
const {saveNewUser, authenticateUser, getUserData, updateShop} = require("../controllers/authentication")
const {upload_profile_picture} = require("../midleware/users")


router.post("/authenticate", (req, res)=>{
  console.log("authentication");
  authenticateUser(req).then(e=>{res.json({valid_authentication:e.valid, name:e.name, has_picture:e.has_picture, is_client:e.is_client, is_provider:e.is_provider, shop_name:e.shop_name, has_shop_picture:e.has_shop_picture, shop_id:e.shop_id})})
})

router.post("/data", (req, res)=>{
  let email = req.body.email;
  console.log(email)
  getUserData(email).then(e=>{res.json({name:e.name, has_picture:e.has_picture, is_client:e.is_client, is_provider:e.is_provider, current_portal:e.current_portal, shop_name:e.shop_name, has_shop_picture:e.has_shop_picture})})
})

router.post("/save", upload_profile_picture.single('profile_picture'), (req, res) => {
    saveNewUser(req).then(response => res.json({successfull: response.successfull, message: response.message }));
  });

router.post("/update_shop", async (req,res)=>{
  updateShop(req, res);
})


module.exports = router