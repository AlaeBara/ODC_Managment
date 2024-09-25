const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const { GenerateEvaluationLink, SubmitEvaluation ,NumberOfCandidates } = require('../Controllers/Evaluation');
const router = express.Router();

router.post('/GenerateEvaluationLink', authenticated, GenerateEvaluationLink);

router.post('/SubmitEvaluation', SubmitEvaluation);

router.get('/SubmitEvaluation', authenticated , NumberOfCandidates);


module.exports = router;