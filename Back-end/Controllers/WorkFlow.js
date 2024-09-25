const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Candidate = require('../Models/candidateModel');
const Courses = require('../Models/courseModel')
const mongoose = require('mongoose');


const getWeekdays = (start, end) => {
  const weekdays = [];
  
 
  if (start > end) {
    return weekdays; // Return empty array if the range is invalid
  }
  
  // Set the start date to the next Monday if it falls on a weekend
  const currentDate = new Date(start);
  if (currentDate.getDay() === 0) { // Sunday
    currentDate.setDate(currentDate.getDate() + 1);
  } else if (currentDate.getDay() === 6) { // Saturday
    currentDate.setDate(currentDate.getDate() + 2);
  }

  // Loop through the date range, incrementing by 1 day
  while (currentDate <= end) {
    weekdays.push(new Date(currentDate)); // Push a copy of the current date
    currentDate.setDate(currentDate.getDate() + 1);

    // Skip weekends
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return weekdays;
};


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

    // Fetch the formation details using the id_Formation
    const course = await Courses.findById(id_Formation);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Log the course object for debugging
    console.log('Fetched Course:', course);

    // Ensure the dates are correctly parsed from the course object
    const formationStartDate = new Date(course.startDate);
    const formationEndDate = new Date(course.endDate);

    // Debugging logs to check date parsing
    console.log('Formation Start Date:', formationStartDate);
    console.log('Formation End Date:', formationEndDate);

    // Check if dates are valid
    if (isNaN(formationStartDate.getTime()) || isNaN(formationEndDate.getTime())) {
      return res.status(400).json({ message: 'Invalid formation dates' });
    }

    // Get weekdays for the formation
    const formationDays = getWeekdays(formationStartDate, formationEndDate);
    console.log('Formation Days:', formationDays); // Debugging line

    // Map Excel rows to the Candidate schema
    const candidates = sheetData.map(row => {
      const participantDates = formationDays.map(sessionDate => ({
        sessionDate,
        morningStatus: 'Absent', // Default to Absent
        afternoonStatus: 'Absent', // Default to Absent
      }));

      return {
        id_Formation,
        email: row['email'] || '',
        firstName: row['firstName'] || '',
        lastName: row['lastName'] || '',
        gender: row['gender'] || '',
        birthdate: row['birthDay'] || '',
        country: row['country'] || '',
        profession: row['profession'] || '',
        age: row['Votre Age'] || null,
        phoneNumber: row['Votre numéro de téléphone'] || '',
        educationLevel: row["Votre niveau d'études"] || '',
        speciality: row['Votre spécialité'] || '',
        participationInODC: row['Avez Vous déjà participer au programmes ODC'] || '',
        presenceState: false,
        sessions: participantDates // Set participants here
      };
    });

    // Insert candidates into MongoDB
    await Candidate.insertMany(candidates);

    // Clean up the uploaded file
    // fs.unlinkSync(filePath); // Uncomment if you want to delete the file after processing

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




///////////////////////////////////////////////////////////////////////////////////////
//API for retrieving candidates will be available within the formation.

const CandidatesAvailable = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid formation ID" });
    }

    const formation = await Courses.findById(id).select('title');

    if (!formation) {
      return res.status(404).json({ success: false, message: "Formation not found" });
    }

    const data = await Candidate.find({ id_Formation: id, presenceState: true });

    res.status(200).json({
      success: true,
      message: "Candidates fetched successfully",
      data: data,
      nameOfFormation: formation.title 
    });

  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching candidates", 
      error: error.message
    });
  }
};


///////////////////////////////////////////////////////////////////////////////////////
// Function to day of formation with out weekday

const dayOfFormation =  async(req, res)=>{
  try {
    const formation = await Courses.findById(req.params.id); 
    const start = new Date(formation.startDate);
    const end = new Date(formation.endDate);

    const weekdays = getWeekdays(start, end);
    
    res.status(200).json({
      success: true,
      days:weekdays,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching formation days',
    });
  }

}


///////////////////////////////////////////////////////////////////////////////////////////////////////
//for update presence

const updatePresence = async (req, res) => {
  try {
    const { sessionDate, morning, afternoon, candidateIds } = req.body;

    // Validate request data
    if (!sessionDate || !candidateIds || candidateIds.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const sessionDateObj = new Date(sessionDate);

    // Map over candidateIds and prepare bulk write operations
    const updates = candidateIds.map(candidateId => {
      const updateFields = {};

      if (morning !== undefined) {
        updateFields['sessions.$.morningStatus'] = morning[candidateId] ? "Present" : "Absent";
      }

      if (afternoon !== undefined) {
        updateFields['sessions.$.afternoonStatus'] = afternoon[candidateId] ? "Present" : "Absent";
      }

      return {
        updateOne: {
          filter: { 
            _id: candidateId, 
            'sessions.sessionDate': sessionDateObj 
          },
          update: { 
            $set: updateFields 
          },
          upsert: true // This will create a new session if it doesn't exist
        }
      };
    });

    // Perform bulk write
    await Candidate.bulkWrite(updates);

    res.json({ message: `Presence updated successfully for ${candidateIds.length} candidates.`});

  } catch (error) {
    console.error("Error updating presence:", error);
    res.status(500).json({ message: "An error occurred while updating presence." });
  }
};



///////////////////////////////////////////////////////////////////////////////////////////////////////
//Api for fetch attendance for a specific date
const getAttendance = async (req, res) => {
  try {
    const { formationId, date } = req.params;
    const sessionDate = new Date(date);

    const candidates = await Candidate.find({ id_Formation: formationId })
      .select('_id sessions')
      .lean();

    const attendance = {};
    candidates.forEach(candidate => {
      const session = candidate.sessions.find(s => s.sessionDate.toDateString() === sessionDate.toDateString());
      attendance[candidate._id] = {
        morning: session?.morningStatus === 'Present',
        afternoon: session?.afternoonStatus === 'Present'
      };
    });

    res.json({ attendance });

  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "An error occurred while fetching attendance." });
  }
};








module.exports = { uploadExcelFile , getAllCandidatesByFormation , toggleCandidatePresence ,CandidatesAvailable, updatePresence ,dayOfFormation  , getAttendance };
