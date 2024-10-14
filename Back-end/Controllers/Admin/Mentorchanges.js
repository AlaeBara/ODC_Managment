const { User } = require('../../Models/userModel');

const DeleteMentor = async (req, res) => {
    const { mentorId } = req.params;
  
    try {
      const deletedMentor = await User.findByIdAndDelete(mentorId);
  
      if (!deletedMentor) {
        return res.status(404).json({ message: 'Mentor not found' });
      }
  
      res.status(200).json({ message: 'Mentor deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting mentor' });
    }
  };
  
  module.exports = { DeleteMentor };