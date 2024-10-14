const { User } = require('../../Models/userModel');
const bcrypt = require('bcryptjs');


const AddMentor= async (req, res) => {
  const { email, password,firstName , lastName} = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({
      email: email,
      password: hashedPassword,
      role: 'Mentor', 
      assignedCourses: [],
      firstName:firstName,
      lastName: lastName
    });

    await user.save();

    res.status(200).json({ message: 'Mentor added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting mentor' });
  }
};

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
  
 module.exports = { DeleteMentor , AddMentor };