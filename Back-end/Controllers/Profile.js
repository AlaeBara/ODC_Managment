const express = require('express');
const router = express.Router();
const { User } = require('../Models/userModel');

const GetProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Get the authenticated user's ID from the middleware
    const user = await User.findById(userId).select('firstName lastName email phoneNumber profilePic');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePic: user.profilePic
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { GetProfile };