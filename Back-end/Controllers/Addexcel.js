const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// MongoDB model
const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String, // Now a string
  },
  birthdate: {
    type: String, // Now a string
  },
  country: {
    type: String,
  },
  profession: {
    type: String,
  },
  age: {
    type: Number,
  },
  phoneNumber: {
    type: String,
  },
  educationLevel: {
    type: String,
  },
  speciality: {
    type: String,
  },
  participationInODC: {
    type: Boolean,
  },
  presenceState: {
    type: Boolean,
  }
});

const DataModel = mongoose.model('Data', DataSchema);

router.post('/api/upload-excel', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Save each row from the Excel file into MongoDB
    const dataToSave = sheetData.map(row => ({
      field1: row['Column1'],  // Adjust this based on Excel column names
      field2: row['Column2'],
      // Add other fields as needed
    }));

    await DataModel.insertMany(dataToSave);

    res.status(200).json({ message: 'File uploaded and data saved to database' });
  } catch (error) {
    console.error('Error processing file', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

module.exports = router;
