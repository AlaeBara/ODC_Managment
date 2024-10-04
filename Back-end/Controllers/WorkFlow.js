const xlsx = require('xlsx');
const path = require('path');
const Candidate = require('../Models/candidateModel');
const Courses = require('../Models/courseModel')
const mongoose = require('mongoose');
const stream = require("stream");
const {google} = require("googleapis");
const KEYFILEPATH = path.join(__dirname, "..", "cred.json");

console.log(__dirname)



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


// const uploadFileToDrive = async (fileObject, fullFileName, userToShareWith, folderName) => {
//   const auth = new google.auth.GoogleAuth({
//       keyFile: KEYFILEPATH, // Path to your credentials file
//       scopes: ["https://www.googleapis.com/auth/drive"],
//   });

//   const driveService = google.drive({ version: "v3", auth });

//   // Create a folder in Google Drive
//   const fileMetadata = {
//       name: folderName,
//       mimeType: "application/vnd.google-apps.folder",
//   };

//   try {
//       const folderResponse = await driveService.files.create({
//           requestBody: fileMetadata,
//           fields: "id",
//       });
//       const folderId = folderResponse.data.id;
//       console.log(`Folder created: ${folderName} with ID: ${folderId}`);

//       // Share the folder with the specified user
//       await shareFolder(driveService, folderId, userToShareWith);

//       // Use the in-memory buffer for file upload
//       const bufferStream = new stream.PassThrough();
//       bufferStream.end(fileObject.buffer);

//       const { data } = await driveService.files.create({
//           media: {
//               mimeType: fileObject.mimetype,
//               body: bufferStream,
//           },
//           requestBody: {
//               name: fullFileName,
//               parents: [folderId], // Specify the folder ID
//           },
//           fields: "id,name",
//       });
//       console.log(`Uploaded file ${data.name} with ID: ${data.id}`);

//       // Share the uploaded file with the specified user
//       await shareFile(driveService, data.id, userToShareWith);

//       return { folderId, fileId: data.id }; // Return folder and file IDs
//   } catch (error) {
//       console.error('Error uploading file to Drive:', error.message);
//       throw new Error('Failed to upload file to Google Drive');
//   }
// };


const uploadFileToDrive = async (fileObject, fullFileName, userToShareWith, folderName) => {
  const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH, // Path to your credentials file
      scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const driveService = google.drive({ version: "v3", auth });

  // Create a folder in Google Drive
  const fileMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
  };

  try {
      const folderResponse = await driveService.files.create({
          requestBody: fileMetadata,
          fields: "id",
      });
      const folderId = folderResponse.data.id;
      console.log(`Folder created: ${folderName} with ID: ${folderId}`);

      // Share the folder with the specified user
      await shareFolder(driveService, folderId, userToShareWith);

      // Use the in-memory buffer for file upload
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileObject.buffer);

      const { data } = await driveService.files.create({
          media: {
              mimeType: fileObject.mimetype,
              body: bufferStream,
          },
          requestBody: {
              name: fullFileName,
              parents: [folderId], // Specify the folder ID
          },
          fields: "id,name",
      });
      console.log(`Uploaded file ${data.name} with ID: ${data.id}`);

      // Share the uploaded file with the specified user
      await shareFile(driveService, data.id, userToShareWith);

      // Set the file to be publicly accessible
      await driveService.permissions.create({
          fileId: data.id,
          requestBody: {
              role: 'reader',
              type: 'anyone', // This makes the file accessible to anyone
          },
      });
      console.log(`File shared publicly: ${data.name}`);

      return { folderId, fileId: data.id }; // Return folder and file IDs
  } catch (error) {
      console.error('Error uploading file to Drive:', error.message);
      throw new Error('Failed to upload file to Google Drive');
  }
};



const shareFolder = async (driveService, folderId, emailAddress) => {
    const permission = {
        type: 'user',
        role: 'writer', 
        emailAddress,
    };

    try {
        await driveService.permissions.create({
            fileId: folderId,
            requestBody: permission,
        });
        console.log(`Folder shared with email: ${emailAddress}`);
    } catch (error) {
        console.error('Error sharing folder:', error.message);
    }
};

const shareFile = async (driveService, fileId, emailAddress) => {
    const permission = {
        type: 'user',
        role: 'writer', 
        emailAddress,
    };

    try {
        await driveService.permissions.create({
            fileId: fileId,
            requestBody: permission,
        });
        console.log(`File shared with email: ${emailAddress}`);
    } catch (error) {
        console.error('Error sharing file:', error.message);
    }
};

// Function to handle Excel file upload and save data to MongoDB
const uploadExcelFile = async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
      }

      const fileBuffer = req.file.buffer; // Get the file buffer from memory
      const id_Formation = req.body.id_Formation;

      // Use xlsx.read to read the buffer directly
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Fetch the formation details using the id_Formation
      const course = await Courses.findById(id_Formation);
      
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      // Extract the file extension from the uploaded file's original name
      const fileExtension = req.file.originalname.split('.').pop();
      
      // Combine course title and file extension to form the complete file name
      const fullFileName = `${course.title}.${fileExtension}`;

      // Upload the file to Google Drive and share it with a user
      const userToShareWith = 'odcmanagmanet@gmail.com'; // Email to share the file with
      const folderName = `Formation ${course.title}`; // Name for the new folder
      await uploadFileToDrive(req.file, fullFileName, userToShareWith, folderName);

      // Ensure the dates are correctly parsed from the course object
      const formationStartDate = new Date(course.startDate);
      const formationEndDate = new Date(course.endDate);

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
