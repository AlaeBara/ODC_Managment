const express = require('express');
const { GetFormationsByFiltrage , Allmentors } = require('../../Controllers/Admin/Formation');
const authenticated = require('../../Middlewares/Authmiddleware');
const router = express.Router();



router.get('/Filtrage', authenticated, GetFormationsByFiltrage)
router.get('/Mentors', authenticated,  Allmentors)




module.exports = router;