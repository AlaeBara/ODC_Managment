const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  contentQuality: { type: Number, min: 1, max: 5 }, // Quality of training content
  acquiredSkillsQuality: { type: Number, min: 1, max: 5 }, // Quality of acquired skills
  alignmentWithNeeds: { type: Number, min: 1, max: 5 }, // Alignment of skills with needs
  trainingStructure: { type: Number, min: 1, max: 5 }, // Structure of the training
  difficultyLevel: { type: Number, min: 1, max: 5 }, // Difficulty level of the training
  trainerPedagogyQuality: { type: Number, min: 1, max: 5 }, // Pedagogical quality of the trainer
  trainerExpertise: { type: Number, min: 1, max: 5 }, // Trainer's expertise
  materialQuality: { type: Number, min: 1, max: 5 }, // Quality of training materials
  exercisesQuality: { type: Number, min: 1, max: 5 }, // Quality of exercises and activities
  adaptationToParticipants: { type: Number, min: 1, max: 5 }, // Adaptation to the profile and level of participants
  roomComfort: { type: Number, min: 1, max: 5 }, // Comfort of the room
  accessibility: { type: Number, min: 1, max: 5 }, // Accessibility of the training venue
  timingAndBreaks: { type: Number, min: 1, max: 5 }, // Timing and breaks
  equipmentCondition: { type: Number, min: 1, max: 5 }, // Condition and availability of training materials
  organizationalCommunication: { type: Number, min: 1, max: 5 }, // Communication of organizational information
  administrativeManagement: { type: Number, min: 1, max: 5 }, // Administrative management
  groupComposition: { type: Number, min: 1, max: 5 }, // Group composition: size and level
  trainingDuration: { type: Number, min: 1, max: 5 }, // Duration of the training
  recommendation: { type: String, enum: ['OUI', 'NON'] }, // Would you recommend this training?
  generalComments: { type: String }, // Comments and overall appreciation
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
