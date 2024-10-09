const express = require('express');
const { Allmentors, Confirmationrate, Totalmentors, GetFormationscount, GetCurrentFormationscount, GetCurrentFormations ,UpcomingFormations,GetFormations } = require('../../Controllers/Admin/Admin');
const authenticated = require('../../Middlewares/Authmiddleware');
const router = express.Router();

router.get('/totalmentors', authenticated, Totalmentors)

router.get('/Totalformations', authenticated, GetFormationscount)

router.get('/GetCurrentFormationsCount', authenticated, GetCurrentFormationscount)

router.get('/GetFormations', GetFormations)

router.get('/Confirmationrate', authenticated, Confirmationrate)

router.get('/allmentors', authenticated, Allmentors)

router.get('/GetCurrentFormations', authenticated, GetCurrentFormations)

router.get('/UpcomingFormations', authenticated, UpcomingFormations)



module.exports = router;