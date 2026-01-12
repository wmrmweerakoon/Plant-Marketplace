const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require('../utils/uploadImage');
const fs = require('fs');

// @desc    Create a new plant listing
// @route   POST /api/plants
// @access  Private (Sellers only)
router.post('/', protect, authorize('seller'), upload.single('image'), async (req, res) => {
  try {
    // Prepare plant data
    const plantData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      careLevel: req.body.careLevel,
      seller: req.user._id
    };

    // Handle image upload to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadImageToCloudinary(req.file.path, 'leaflink/plants');
        plantData.imageUrl = result.url;
        plantData.imagePublicId = result.public_id;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Clean up the temporary file if upload fails
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
      }
    } else {
      // If no image is uploaded, use the imageUrl from the request body
      plantData.imageUrl = req.body.imageUrl || '';
      plantData.imagePublicId = null;
    }

    // Create the plant
    const plant = await Plant.create(plantData);

    res.status(201).json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Plant creation error:', error);
    res.status(500).json({ message: 'Server error during plant creation' });
 }
});

// @desc    Get all plants
// @route   GET /api/plants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().populate('seller', 'name email');
    
    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Get plants error:', error);
    res.status(500).json({ message: 'Server error during fetching plants' });
  }
});

// @desc    Get plants for logged-in seller only
// @route   GET /api/plants/seller
// @access  Private (Sellers only)
router.get('/seller', protect, authorize('seller'), async (req, res) => {
  try {
    const plants = await Plant.find({ seller: req.user._id }).populate('seller', 'name email');
    
    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Get seller plants error:', error);
    res.status(500).json({ message: 'Server error during fetching seller plants' });
  }
});

// @desc    Delete a plant listing
// @route   DELETE /api/plants/:id
// @access  Private (Sellers only, and only their own plants)
router.delete('/:id', protect, authorize('seller'), async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }
    
    // Check if the logged in user is the owner of the plant
    if (plant.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this plant' });
    }
    
    // If the plant has an image in Cloudinary, delete it
    if (plant.imagePublicId) {
      try {
        // Use the stored public_id to delete from Cloudinary
        await deleteImageFromCloudinary(plant.imagePublicId);
      } catch (deleteErr) {
        console.error('Error deleting image from Cloudinary:', deleteErr);
        // Continue with deletion even if Cloudinary delete fails
      }
    } else if (plant.imageUrl) {
      // Fallback: try to extract public ID from URL for older entries
      try {
        // This is a simplified approach for backward compatibility
        const urlParts = plant.imageUrl.split('/');
        const imageName = urlParts[urlParts.length - 1];
        const publicId = imageName.split('.')[0]; // Remove extension
        
        // Attempt to delete from Cloudinary (it's ok if this fails)
        await deleteImageFromCloudinary(`leaflink/plants/${publicId}`);
      } catch (deleteErr) {
        console.error('Error deleting image from Cloudinary:', deleteErr);
        // Continue with deletion even if Cloudinary delete fails
      }
    }
    
    await Plant.findByIdAndDelete(plant._id);
    
    res.status(200).json({ success: true, message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Plant deletion error:', error);
    res.status(500).json({ message: 'Server error during plant deletion' });
  }
});

// @desc    Update a plant listing
// @route   PUT /api/plants/:id
// @access  Private (Sellers only, and only their own plants)
router.put('/:id', protect, authorize('seller'), upload.single('image'), async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }
    
    // Check if the logged in user is the owner of the plant
    if (plant.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this plant' });
    }

    // Prepare update data
    const updateData = {
      name: req.body.name || plant.name,
      category: req.body.category || plant.category,
      price: req.body.price || plant.price,
      stock: req.body.stock || plant.stock,
      description: req.body.description || plant.description,
      careLevel: req.body.careLevel || plant.careLevel
    };

    // Handle image upload to Cloudinary if provided
    if (req.file) {
      try {
        // If the plant already has an image in Cloudinary, delete it first
        if (plant.imagePublicId) {
          await deleteImageFromCloudinary(plant.imagePublicId);
        }

        const result = await uploadImageToCloudinary(req.file.path, 'leaflink/plants');
        updateData.imageUrl = result.url;
        updateData.imagePublicId = result.public_id;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Clean up the temporary file if upload fails
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
      }
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('seller', 'name email');

    res.status(200).json({
      success: true,
      data: updatedPlant
    });
  } catch (error) {
    console.error('Plant update error:', error);
    res.status(500).json({ message: 'Server error during plant update' });
  }
});

module.exports = router;
