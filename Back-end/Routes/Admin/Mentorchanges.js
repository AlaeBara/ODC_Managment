const express = require('express');
const { DeleteMentor } = require('../../Controllers/Admin/Mentorchanges');
const authenticated = require('../../Middlewares/Authmiddleware');
const verifyRole = require('../../Middlewares/verifyRole');
const router = express.Router();


router.delete('/mentors/:mentorId', authenticated, verifyRole(['Admin']), DeleteMentor);


module.exports = router;