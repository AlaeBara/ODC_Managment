const express = require('express');
const { Allmentors, Confirmationrate, Totalmentors, GetFormationscount, GetCurrentFormationscount, GetFormations } = require('../Controllers/Admin');
const authenticated = require('../Middlewares/Authmiddleware');
const router = express.Router();

router.get('/totalmentors', authenticated, Totalmentors)
router.get('/Totalformations', authenticated, GetFormationscount)
router.get('/GetCurrentFormations', authenticated, GetCurrentFormationscount)
router.get('/GetFormations', GetFormations)
router.get('/Confirmationrate', authenticated, Confirmationrate)
router.get('/allmentors', authenticated, Allmentors)

module.exports = router;