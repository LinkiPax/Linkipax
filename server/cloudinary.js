const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require('path');
require("dotenv").config();

// Configure Cloudinary with enhanced settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

// Sanitize filename for Cloudinary public_id
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9-_]/g, '_') // Replace special chars with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/\.mp4$/, '') // Remove .mp4 extension
    .substring(0, 100); // Limit length
};

// Enhanced storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "linkify-shorts",
    resource_type: "video",
    allowed_formats: ['mp4', 'mov', 'avi'], // Explicit allowed formats
    format: async (req, file) => {
      const ext = path.extname(file.originalname).substring(1);
      return ['mp4', 'mov', 'avi'].includes(ext) ? ext : 'mp4';
    },
    public_id: (req, file) => {
      const timestamp = Date.now();
      const cleanName = sanitizeFilename(file.originalname);
      return `short_${timestamp}_${cleanName}`;
    },
    chunk_size: 6000000, // 6MB chunks for large files
    eager: [
      { width: 640, height: 360, crop: "scale" } // Create optimized version
    ],
    eager_async: true,
    invalidate: true
  }
});

// Utility function to delete uploaded files
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
      invalidate: true
    });
  } catch (err) {
    console.error("Error deleting from Cloudinary:", err);
    throw err;
  }
};

module.exports = { 
  cloudinary, 
  storage, 
  deleteFromCloudinary 
};