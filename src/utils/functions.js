const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('./config');
const multer = require('multer');

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUDINARY_CLOUD,
  api_key: config.CLOUDINARY.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY.CLOUDINARY_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Ecommerce',
    format: async (req, file) => {
      'jpg', 'png';
    }, // supports promises as well
    public_id: (req, file) => {
      console.log(
        new Date().toISOString().replace(/:/g, '-') + file.originalname
      );
      return new Date().toISOString().replace(/:/g, '-') + file.originalname;
    },
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
