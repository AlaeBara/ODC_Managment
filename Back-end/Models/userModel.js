const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String},
    email: { type: String, required: true, unique: true }, // Add this line
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Mentor'], required: true },
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // Only for mentors
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
