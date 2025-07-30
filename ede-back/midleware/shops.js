const multer = require('multer');
const path = require('path');



var shops_pictures_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'static/shops_pictures')
    },
    filename: function (req, file, cb) {
      console.log("SHOP MIDLEWARE")
      cb(null, req.body.email+'.jpg')
    }
  })

const upload_shop_image = multer({
  storage: shops_pictures_storage,
  limits:{fileSize:'1000000'},
  fileFilter:(req, file, callback)=>{
      const fileType = /jpeg|jpg|png|gif/
      const mimeType = fileType.test(file.mimetype)
      const extname = fileType.test(path.extname(file.originalname))
      if(mimeType && extname){
          return callback(null, true)
      }
      callback('Give proper file format to upload')
  }
})
  module.exports = {"uploadShopImage":upload_shop_image};