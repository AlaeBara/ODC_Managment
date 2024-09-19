const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const now = new Date();
    // Format date as YYYY-MM-DD and time as HH-MM (without seconds)
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-').slice(0, 5); // HH-MM
    // Get the original file name without extension
    const originalName = file.originalname.split('.')[0]; // Only the name without extension
    // Get the file extension
    const fileExtension = path.extname(file.originalname);
    // Combine date, time, and original name, and append the file extension
    cb(null, `${date}T${time}-${originalName}${fileExtension}`);
  },
});

// Create upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
