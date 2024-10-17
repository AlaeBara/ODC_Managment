const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const { GetPresencedata } = require('../Controllers/Presence');
const router = express.Router();

router.get('/GetPresencedata/:id', authenticated, GetPresencedata);

module.exports = router;