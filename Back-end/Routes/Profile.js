const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const {GetProfile} = require('../Controllers/Profile');
const router = express.Router();

router.get('/Getprofile', authenticated, GetProfile);

module.exports = router;