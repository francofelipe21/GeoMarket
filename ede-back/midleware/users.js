const multer = require('multer');
const path = require('path');

var profiles_pictures_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'static/profiles_pictures')
    },
    filename: function (req, file, cb) {
      cb(null, req.body.email+'.jpg')
    }
  })

const upload_profile_picture = multer({
    storage: profiles_pictures_storage,
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

module.exports = {"upload_profile_picture": upload_profile_picture}