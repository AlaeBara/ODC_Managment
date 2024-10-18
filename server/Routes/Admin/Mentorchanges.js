const express = require('express');
const { DeleteMentor,AddMentor , ResetMentorPassword  } = require('../../Controllers/Admin/Mentorchanges');
const authenticated = require('../../Middlewares/Authmiddleware');
const verifyRole = require('../../Middlewares/verifyRole');
const router = express.Router();

router.post('/addmentor',authenticated, AddMentor)

router.delete('/mentors/:mentorId', authenticated, DeleteMentor);

router.put('/mentors/:mentorId', authenticated, ResetMentorPassword );

module.exports = router;
