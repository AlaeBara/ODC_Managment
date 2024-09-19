const express = require('express');
const { uploadExcelFile , getAllCandidatesByFormation } = require('../Controllers/WorkFlow');
const authenticated = require('../Middlewares/Authmiddleware');
const upload = require('../Middlewares/Multer'); // Import multer middleware

const router = express.Router();


// Route to handle Excel file upload
router.post('/upload-excel', authenticated, upload.single('file'), uploadExcelFile);

// Route to Get Candidates By Formation
router.get('/Candidates/:id', authenticated,   getAllCandidatesByFormation );

module.exports = router;
