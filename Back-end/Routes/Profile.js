const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware');
const { Getprofile, Updateprofile, Uploadimage } = require('../Controllers/Profile'); // Ensure path is correct
const router = express.Router();
const multer = require('multer');

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

//normal routes
router.get('/Getprofile', authenticated, Getprofile);

router.put('/Updateprofile', authenticated, Updateprofile);

router.post('/upload-profile-picture', authenticated, upload.single('image'), Uploadimage);

module.exports = router;