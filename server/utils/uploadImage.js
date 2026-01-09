const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: false,
      unique_filename: true,
      overwrite: false,
      resource_type: 'image',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

module.exports = { uploadImageToCloudinary, deleteImageFromCloudinary };

