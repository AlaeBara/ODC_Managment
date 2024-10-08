const express = require('express');
const { Allmentors, Confirmationrate, Totalmentors, GetFormationscount, GetCurrentFormationscount, GetFormations } = require('../Controllers/Admin');
const authenticated = require('../Middlewares/Authmiddleware');
const router = express.Router();

router.get('/totalmentors', Totalmentors)
router.get('/Totalformations', GetFormationscount)
router.get('/GetCurrentFormations', GetCurrentFormationscount)
router.get('GetFormations', GetFormations)
router.get('/Confirmationrate', Confirmationrate)
router.get('/allmentors', Allmentors)

module.exports = router;