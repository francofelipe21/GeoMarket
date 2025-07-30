const multer = require('multer');
const path = require('path');

var products_pictures_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'static/products_pictures')
    },
    filename: function (req, file, cb) {
      console.log(req)
      cb(null, req.body.email+"_"+req.body.name+'.jpg')
    }
  })

const upload_product = multer({
  storage: products_pictures_storage,
  limits:{fileSize:'1000000'},
  fileFilter:(req, file, callback)=>{
      const fileType = /jpeg|jpg|png|gif/
      const mimeType = fileType.test(file.mimetype)
      const extname = fileType.test(path.extname(file.originalname))
      if(mimeType && extname){
          return callback(null, true)
      }
      callback('Give proper file format to upload')
  }})


module.exports = {"upload_product":upload_product}
