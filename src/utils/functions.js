const multer = require('multer');
const uniqid = require( 'uniqid');
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },

  filename: function (req, file, cb) {
    let originalname = file.originalname;
    let extension = originalname.split('.');
    let nombre = !req.body.nombre
      ? (req.body.nombre = 'image')
      : req.body.nombre;
  
      filename =
        nombre + '.' +uniqid() + '.' + extension[extension.length - 1];

    cb(null, filename);
  },
 
});
 
var upload = multer({ storage: storage , limits: { fileSize: 5000000 } })

const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err) {
    res.send(413);
  } else {
    next();
  }
};

module.exports = { upload, fileSizeLimitErrorHandler };
