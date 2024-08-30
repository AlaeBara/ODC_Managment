const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String }],
  schedule: [
    {
      sessionDate: { type: Date, required: true }, // Date and time of each session
      sessionTime: { type: String, required: true } // Specific time of the session
    }
  ],
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
