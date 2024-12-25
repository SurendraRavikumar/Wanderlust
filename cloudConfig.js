const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Here we are connect/Configuring our backend with cloudinary account.........
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Here we creating a floder called wanderlust in the Cloudinary Service to store our iles/photos...
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats:["png","jpg","jpeg"]
    },
  });

  module.exports = {
    cloudinary,
    storage
  }