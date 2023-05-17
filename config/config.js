const dotenv = require("dotenv");

dotenv.config({
  silent: process.env.NODE_ENV === "production",
});

module.exports = {
  CLOUDINARY: {
    API_KEY_CLOUDINARY: process.env.API_KEY_CLOUDINARY,
    API_SECRET_CLOUDINARY: process.env.API_SECRET_CLOUDINARY,
    CLOUD_NAME: process.env.CLOUD_NAME

  },
  SECRET: process.env.SECRET
};
