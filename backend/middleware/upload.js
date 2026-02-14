const multer = require('multer');
const path = require('path');

// Check if we're using Cloudinary (for production like Railway)
const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

let cloudinary, CloudinaryStorage;

if (useCloudinary) {
  // Load Cloudinary only if credentials exist
  cloudinary = require('cloudinary').v2;
  CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  console.log('✅ Using Cloudinary for file storage');
} else {
  console.log('ℹ️ Using local filesystem for file storage');
}

// Storage configuration
const getProductStorage = () => {
  if (useCloudinary) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'premium-wood/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      }
    });
  } else {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/products/');
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
  }
};

const getBlogStorage = () => {
  if (useCloudinary) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'premium-wood/blogs',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      }
    });
  } else {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/blogs/');
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
  }
};

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const uploadProduct = multer({
  storage: getProductStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

const uploadBlog = multer({
  storage: getBlogStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = { uploadProduct, uploadBlog };

