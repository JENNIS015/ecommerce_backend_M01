const multer = require('multer');
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    let originalname = file.originalname;
    let extension = originalname.split('.');
    filename = Date.now() + '.' + extension[extension.length - 1];

    cb(null, filename);
  },
});
 
var upload = multer({ storage: storage })

module.exports = { upload };
