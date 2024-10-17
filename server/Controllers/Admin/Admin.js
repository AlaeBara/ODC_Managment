const { User } = require('../../Models/userModel');
const Course = require('../../Models/courseModel');  
const Candidate = require('../../Models/candidateModel');


const Totalmentors = async (req, res) => {
  try {
    const mentorCount = await User.countDocuments({ role: 'Mentor' });
    res.status(200).json({ totalMentors: mentorCount });
  } catch (error) {
    res.status(500).json({ message: 'Error counting mentors', error });
  }
};

const GetFormationscount = async (req, res) => {
    try {
      const courseCount = await Course.countDocuments();
      res.status(200).json({ totalCourses: courseCount });
    } catch (error) {
      res.status(500).json({ message: 'Error counting courses', error: error.message });
    }
};



const GetCurrentFormationscount = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentFormationCount = await Course.countDocuments({
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
        });

        res.status(200).json({ currentFormations: currentFormationCount });
    } catch (error) {
        res.status(500).json({ message: 'Error counting current formations', error: error.message });
    }
};


const GetFormations = async (req, res) => {
    try {
        const courses = await Course.find().populate('mentors');  
        res.status(200).json({ courses: courses });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
};

//current formation
const GetCurrentFormations = async (req, res) => {
  try {
      const currentDate = new Date();
      const currentFormationCount = await Course.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
      }).populate('mentors');

      res.status(200).json({ currentFormations: currentFormationCount });
  } catch (error) {
      res.status(500).json({ message: 'Error counting current formations', error: error.message });
  }
};


//upcoming formation
const UpcomingFormations = async (req, res) => {
  try {
      const currentDate = new Date();
      const upcomingFormation = await Course.find({
      startDate: { $gte: currentDate },
      }).populate('mentors');

      res.status(200).json({ upcomingFormation: upcomingFormation });
  } catch (error) {
      res.status(500).json({ message: 'Error counting upcoming formations', error: error.message });
  }
};


const Confirmationrate = async (req, res) => {
    try {
        const totalCandidates = await Candidate.countDocuments();
    
        const confirmedCandidates = await Candidate.countDocuments({ presenceState: true });
    
        const confirmationRate = totalCandidates === 0 ? 0 : (confirmedCandidates / totalCandidates) * 100;
    
        res.status(200).json({ 
          totalCandidates,
          confirmedCandidates,
          confirmationRate: confirmationRate.toFixed(2)
        });
      } catch (error) {
        res.status(500).json({ message: 'Error calculating confirmation rate', error: error.message });
      }
};


const Allmentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'Mentor' }).select('-password'); // Exclude password from response

    if (mentors.length === 0) {
      return res.status(404).json({ message: 'No mentors found' });
    }

    // Fetch the count of courses for each mentor
    const mentorData = await Promise.all(mentors.map(async (mentor) => {
      const courseCount = await Course.countDocuments({ mentors: mentor._id }); // Count courses where the mentor is included in the mentors array

      return {
        _id: mentor._id,
        email: mentor.email,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        phoneNumber: mentor.phoneNumber,
        profilePic: mentor.profilePic,
        courseCount, // Include the count of courses for each mentor
      };
    }));

    res.status(200).json(mentorData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }
};














module.exports = { Totalmentors, GetFormationscount, GetCurrentFormationscount, GetCurrentFormations,UpcomingFormations, GetFormations, Confirmationrate, Allmentors };
