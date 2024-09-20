const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Candidate = require('../models/candidateModel');
const mongoose = require('mongoose');

// Function to handle Excel file upload and save data to MongoDB
const uploadExcelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const id_Formation = req.body.id_Formation;

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map Excel rows to the Candidate schema
    const candidates = sheetData.map(row => ({
      id_Formation,
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
      presenceState: false,
    }));

    // Insert candidates into MongoDB
    await Candidate.insertMany(candidates);

    // Clean up the uploaded file
    // fs.unlinkSync(filePath);

    res.status(200).json({ message: 'File uploaded and data saved to database' });
  } catch (error) {
    console.error('Error processing file', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};





///////////////////////////////////////////////////////////////////////////////////////


// Function to get all candidates for a specific formation
const getAllCandidatesByFormation = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Received formation ID:', id); // Log the received ID

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { id_Formation: new mongoose.Types.ObjectId(id) };
    } else {
      query = { id_Formation: id };
      console.log('ID is not a valid ObjectId, using as-is');
    }

    const data = await Candidate.find(query);
     

    res.status(200).json({
      message: "Candidates fetched successfully",
      data: data
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ 
      message: "Error fetching candidates", 
      error: error.message
    });
  }
};





///////////////////////////////////////////////////////////////////////////////////////

//API for setting a candidate as valid or not

const toggleCandidatePresence = async (req, res) => {
  try {
    const { id } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid candidate ID" });
    }

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    candidate.presenceState = !candidate.presenceState;

    await candidate.save();

    return res.status(200).json({
      success: true,
      message: `Candidate's presence state updated successfully`,
      presenceState: candidate.presenceState,
    });
  } catch (error) {
    console.error('Error toggling presence state:', error);
    res.status(500).json({ 
      success: false,
      message: "Error toggling presence state", 
      error: error.message 
    });
  }
};













module.exports = { uploadExcelFile , getAllCandidatesByFormation , toggleCandidatePresence };
