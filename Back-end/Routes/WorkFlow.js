const express = require('express');
const { uploadExcelFile , getAllCandidatesByFormation , toggleCandidatePresence  } = require('../Controllers/WorkFlow');
const authenticated = require('../Middlewares/Authmiddleware');
const upload = require('../Middlewares/Multer');

const router = express.Router();


// Route to handle Excel file upload
router.post('/upload-excel', authenticated, upload.single('file'), uploadExcelFile);

// Route to Get Candidates By Formation
router.get('/Candidates/:id', authenticated,   getAllCandidatesByFormation );

//Route to toggle candidate presence state
router.post('/toggle-presence', toggleCandidatePresence);

module.exports = router;
