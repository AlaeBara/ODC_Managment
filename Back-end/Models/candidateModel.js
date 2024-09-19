const mongoose = require('mongoose');

// Define the Candidate schema
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
});

// Create and export the model
const Candidate = mongoose.model('Candidate', CandidateSchema);


module.exports = Candidate;
