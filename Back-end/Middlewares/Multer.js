const multer = require('multer');

// Configure multer for file uploads using memoryStorage
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;
