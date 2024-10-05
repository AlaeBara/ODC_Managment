
const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const { Gethomepageinfo } = require('../Controllers/HomepageApi');
const router = express.Router();

router.get('/gethomepageinfo', authenticated, Gethomepageinfo);


module.exports = router;