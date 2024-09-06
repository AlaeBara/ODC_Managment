const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const {Getprofile, Updateprofile} = require('../Controllers/Profile');
const router = express.Router();

router.get('/Getprofile', authenticated, Getprofile);

router.put('/Updateprofile', authenticated, Updateprofile);

module.exports = router;