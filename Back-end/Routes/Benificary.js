const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const {NumberOfCandidatesConfirmer,NumberOfCandidatesPresence} = require('../Controllers/Benificary');
const router = express.Router();

router.get('/NumberOfCandidatesConfirmer' , NumberOfCandidatesConfirmer )

router.get('/NumberOfCandidatesPresence' , NumberOfCandidatesPresence )





module.exports = router;