const express = require('express');
const authenticated = require('../Middlewares/Authmiddleware')
const { GenerateEvaluationLink, SubmitEvaluation } = require('../Controllers/Evaluation');
const router = express.Router();

router.post('/GenerateEvaluationLink', authenticated, GenerateEvaluationLink);

router.post('/SubmitEvaluation', SubmitEvaluation);


module.exports = router;