const express = require('express');
const {Login} = require('../Controllers/auth');


const router = express.Router();


// Route for user signIn
router.post('/signIn', Login);



module.exports = router;