const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String },  // Not required
    lastName: { type: String },   // Not required
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },  // Optional
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Mentor'], required: true },
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    profilePic: { type: String }  // Optional
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
