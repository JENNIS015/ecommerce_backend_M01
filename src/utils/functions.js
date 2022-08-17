const  multer = require('multer')

function middleware(req, res, next) {
  let imageName;

  let uploadStorage = multer.diskStorage({
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

  let upload = multer({ storage: uploadStorage });
  let uploadFile = upload.single('avatar');

  uploadFile(req, res, function (err) {
    req.imageName = imageName;
    req.uploadError = err;

    next();
  });
}

module.exports = { middleware };