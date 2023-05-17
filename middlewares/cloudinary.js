const cloudinary = require ('cloudinary').v2;
const CONFIG=require("../config/config")
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({ 
  cloud_name: CONFIG.CLOUDINARY.CLOUD_NAME, 
  api_key: CONFIG.CLOUDINARY.API_KEY_CLOUDINARY, 
  api_secret: CONFIG.CLOUDINARY.API_SECRET_CLOUDINARY, 
  });
  
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Inkalandia',
    format: async (req, file) => {
      'jpg', 'png';
    }, // supports promises as well
    public_id: (req, file) => {
    
      return new Date().toISOString().replace(/:/g, '-') + file.originalname;
    },
  },
});
const upload = multer({ storage: storage });

const cloudinaryUpload = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      {
        resource_type: 'auto',
        folder: folder,
      },
      (err, result) => {
        if (!err) {
          resolve({
            url: result.url,
            public_id: result.public_id,
          });
        } else {
          throw err;
        }
      }
    );
  }).catch((error) => {
    throw error;
  });
};
 

module.exports = { upload, cloudinaryUpload };
