const express = require('express');
const { DeleteMentor,AddMentor } = require('../../Controllers/Admin/Mentorchanges');
const authenticated = require('../../Middlewares/Authmiddleware');
const verifyRole = require('../../Middlewares/verifyRole');
const router = express.Router();

router.post('/addmentor',authenticated, verifyRole(['Admin']), AddMentor)

router.delete('/mentors/:mentorId', authenticated, verifyRole(['Admin']), DeleteMentor);


module.exports = router;