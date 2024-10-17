const { User } = require('../../Models/userModel');
const Course = require('../../Models/courseModel');  
const Candidate = require('../../Models/candidateModel');


const GetFormationsByFiltrage = async (req, res) => {
    try {
      const { search, startDate, endDate, mentorId } = req.query; // Get filters from query parameters
  
      // Build the filter object dynamically
      let filter = {};
  
      // Search by keyword in title or description (case-insensitive)
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } }, // Case-insensitive regex for title
          { description: { $regex: search, $options: 'i' } }, // Case-insensitive regex for description
        ];
      }
  
      // Filter by date range
      if (startDate) {
        filter.startDate = { $gte: new Date(startDate) }; // Courses starting on or after the startDate
      }
      if (endDate) {
        filter.endDate = { $lte: new Date(endDate) }; // Courses ending on or before the endDate
      }
  
      // Filter by mentor
      if (mentorId) {
        filter.mentors = mentorId; // Find courses where the mentor matches
      }
  
      // Fetch filtered courses and populate mentors
      const courses = await Course.find(filter).populate('mentors');
  
      // If no courses are found, return an empty array and a message
      if (courses.length === 0) {
        return res.status(200).json({ courses: [], message: 'No formations found for the given criteria' });
      }
  
      res.status(200).json({ courses: courses });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching filtered courses', error: error.message });
    }
};
  
  
  

const Allmentors = async (req, res) => {
    try {
      const mentors = await User.find({ role: 'Mentor' }).select('-password'); // Exclude password from response
  
      if (mentors.length === 0) {
        return res.status(404).json({ message: 'No mentors found' });
      }
  
      const mentorData = mentors.map(mentor => ({
        _id: mentor._id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        profilePic: mentor.profilePic,
      }));
  
      res.status(200).json(mentorData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching mentors', error: error.message });
    }
};






module.exports = {GetFormationsByFiltrage , Allmentors};
