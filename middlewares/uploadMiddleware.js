const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// Accept all file types, validation will be in controller
const upload = multer({ storage });

const handleSingleUpload = (field) => (req, res, next) => {
  upload.single(field)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

const handleMultiUpload = (field, maxCount = 5) => (req, res, next) => {
  upload.array(field, maxCount)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

module.exports = { handleSingleUpload, handleMultiUpload };
