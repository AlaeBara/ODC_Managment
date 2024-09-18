const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const authenticated = require('../Middlewares/Authmiddleware');

// Define the Candidate schema
const CandidateSchema = new mongoose.Schema({
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

// Create the model
const Candidate = mongoose.model('Candidate', CandidateSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Route to handle Excel file upload and save data to MongoDB
router.post('/upload-excel', authenticated, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map Excel rows to the Candidate schema
    const candidates = sheetData.map(row => ({
      email: row['Email'] || '',
      firstName: row['First Name'] || '',
      lastName: row['Last Name'] || '',
      gender: row['Gender'] || '',
      birthdate: row['Birthdate'] || '',
      country: row['Country'] || '',
      profession: row['Profession'] || '',
      age: row['Age'] || null,
      phoneNumber: row['Phone Number'] || '',
      educationLevel: row['Education Level'] || '',
      speciality: row['Speciality'] || '',
      participationInODC: row['Participation in ODC'] || '',
      presenceState: row['Presence State'] === 'Present',
    }));

    // Insert candidates into MongoDB
    await Candidate.insertMany(candidates);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'File uploaded and data saved to database' });
  } catch (error) {
    console.error('Error processing file', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

module.exports = router;
