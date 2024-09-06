const express = require('express');
const router = express.Router();
const { User } = require('../Models/userModel');

const Getprofile = async (req, res) => {
  try {
    const userId = req.user.userId; // Get the authenticated user's ID from the middleware
    const user = await User.findById(userId).select('firstName lastName email phoneNumber role profilePic');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePic: user.profilePic,
      role: user.role
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const Updateprofile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, email, phoneNumber, profilePic } = req.body;

    // Build an object to hold only the fields that are provided
    const updateFields = {};

    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (profilePic) updateFields.profilePic = profilePic;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },  // Use $set to update only specified fields
      { new: true, runValidators: true }  // Return updated document and validate
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { Getprofile, Updateprofile};