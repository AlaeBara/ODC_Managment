const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  id_Formation:{type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  birthdate: { type: String },
  country: { type: String },
  profession: { type: String },
  age: { type: Number },
  phoneNumber: { type: String },
  educationLevel: { type: String },
  speciality: { type: String },
  participationInODC: { type: String },
  presenceState: { type: Boolean },
  participants: [
    {
      sessionDate: { type: Date, required: true },
      morningStatus: { type: String, enum: ['Present', 'Absent'], default: 'Absent' }, // 9 AM - 1 PM
      afternoonStatus: { type: String, enum: ['Present', 'Absent'], default: 'Absent' } // 2 PM - 4 PM
    }
  ]
});


const Candidate = mongoose.model('Candidate', CandidateSchema);


module.exports = Candidate;
