const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String }],
  schedule: [
    {
      sessionDate: { type: Date, required: true },
      sessionTime: { type: String, required: true },
    },
  ],
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;  // Export the Course model
