const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  sessionDate: { type: Date, required: true },
  participants: [
    {
      participantName: { type: String, required: true },
      morningStatus: { type: String, enum: ['Present', 'Absent'], default: 'Absent' }, // 9 AM - 1 PM
      afternoonStatus: { type: String, enum: ['Present', 'Absent'], default: 'Absent' } // 2 PM - 4 PM
    }
  ]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
