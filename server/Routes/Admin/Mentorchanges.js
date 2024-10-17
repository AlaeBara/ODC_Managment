const express = require('express');
const { DeleteMentor,AddMentor , ResetMentorPassword  } = require('../../Controllers/Admin/Mentorchanges');
const authenticated = require('../../Middlewares/Authmiddleware');
const verifyRole = require('../../Middlewares/verifyRole');
const router = express.Router();

router.post('/addmentor',authenticated, verifyRole(['Admin']), AddMentor)

router.delete('/mentors/:mentorId', authenticated, verifyRole(['Admin']), DeleteMentor);

router.put('/mentors/:mentorId', authenticated, verifyRole(['Admin']), ResetMentorPassword );

module.exports = router;