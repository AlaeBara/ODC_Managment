const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const {AddFormation, GetOneFormations, UpdateFormations, GetFormations, DeleteFormations} = require('../Controllers/Formation');
const router = express.Router();



router.post('/Addformation',authenticated, AddFormation);

router.get('/GetFormations', GetFormations);

router.get('/GetOneFormations/:id', GetOneFormations);

router.put('/UpdateFormations/:id', UpdateFormations);

router.delete('/DeleteFormations/:id', DeleteFormations);

module.exports = router;