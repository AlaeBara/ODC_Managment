const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const { GenerateEvaluationLink, SubmitEvaluation ,NumberOfCandidates, getEvaluationsByCourse } = require('../Controllers/Evaluation');
const router = express.Router();

router.post('/GenerateEvaluationLink', authenticated, GenerateEvaluationLink);

router.post('/SubmitEvaluation', SubmitEvaluation);

router.get('/SubmitEvaluation', authenticated , NumberOfCandidates);

//router.get('/api/evaluations/:formationId', authenticated, getEvaluationsByCourse)


module.exports = router;