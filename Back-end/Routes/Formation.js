const express = require('express');
const {AddFormation} = require('../Controllers/Formation');
//const authenticated = require('../Middlewares/Authmiddleware')
const {GetFormations} = require('../Controllers/Formation')
const router = express.Router();

router.post('/Addformation', AddFormation);

router.get('/GetFormations', GetFormations);

module.exports = router;