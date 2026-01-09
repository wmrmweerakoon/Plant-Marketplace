const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

module.exports = upload;