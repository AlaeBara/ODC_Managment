
const Course = require('../Models/courseModel');
const Candidate = require('../Models/candidateModel');
const { User } = require('../Models/userModel');

const Gethomepageinfo = async (req, res) => {
    try {
        const userId = req.user.userId;
    
        const user = await User.findOne({ _id: userId }).select('firstName');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const assignedCourses = await Course.find({ mentors: userId });
        const totalFormations = assignedCourses.length;
    
        const studentCounts = await Promise.all(
            assignedCourses.map(course => 
                Candidate.countDocuments({ id_Formation: course._id })
            )
        );
        const totalStudents = studentCounts.reduce((sum, count) => sum + count, 0);
    
        res.json({
            firstName: user.firstName,
            totalStudents,
            totalFormations
        });
    
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { Gethomepageinfo };
