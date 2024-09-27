const express = require('express');
const {Login} = require('../Controllers/Login');
const authenticated = require('../Middlewares/Authmiddleware')
const router = express.Router();

router.post('/signIn', Login);

router.get('/validate-token', authenticated, (req, res) => {
    res.status(200).json({ message: 'Token is valid.', user: req.user });
});


router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});



module.exports = router;