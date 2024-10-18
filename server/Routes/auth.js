const express = require('express');
const {Login} = require('../Controllers/Login');
const authenticated = require('../Middlewares/Authmiddleware')
const verifyRole = require('../Middlewares/verifyRole')
const router = express.Router();

router.post('/signIn', Login);

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});



module.exports = router;
