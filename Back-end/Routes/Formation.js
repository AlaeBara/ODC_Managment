const express = require('express');
//const authenticated = require('../Middlewares/Authmiddleware')
const {AddFormation} = require('../Controllers/Formation');
const {GetOneFormations} = require('../Controllers/Formation');
const {UpdateFormations} = require('../Controllers/Formation')
const {GetFormations} = require('../Controllers/Formation')
const {DeleteFormations} = require('../Controllers/Formation')
const router = express.Router();



router.post('/Addformation', AddFormation);

router.get('/GetFormations', GetFormations);

router.get('/GetOneFormations', GetOneFormations);

router.get('/GetOneFormations', UpdateFormations);

router.get('/GetOneFormations', DeleteFormations);


module.exports = router;