const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const {AddFormation, GetOneFormations, UpdateFormations, GetFormations, DeleteFormations} = require('../Controllers/Formation');
const router = express.Router();


router.post('/Addformation', authenticated, AddFormation);

router.get('/GetFormations', authenticated, GetFormations);

router.get('/GetOneFormations/:id', authenticated, GetOneFormations);

router.put('/UpdateFormations/:id', authenticated, UpdateFormations);

router.post('/DeleteFormations',  DeleteFormations);

module.exports = router;