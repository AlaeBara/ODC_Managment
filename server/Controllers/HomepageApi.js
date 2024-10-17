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
        const courseIds = assignedCourses.map(course => course._id);
    
        const studentStats = await Candidate.aggregate([
            { $match: { id_Formation: { $in: courseIds } } },
            {
                $project: {
                    hasAttended: {
                        $cond: {
                            if: {
                                $gt: [
                                    {
                                        $size: {
                                            $filter: {
                                                input: "$sessions",
                                                as: "session",
                                                cond: {
                                                    $or: [
                                                        { $eq: ["$$session.morningStatus", "Present"] },
                                                        { $eq: ["$$session.afternoonStatus", "Present"] }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                            then: 1,
                            else: 0
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    totalPresentstudents: { $sum: "$hasAttended" }
                }
            }
        ]);
    
        const { totalStudents, totalPresentstudents } = studentStats[0] || { totalStudents: 0, totalPresentstudents: 0 };
    
        res.json({
            firstName: user.firstName,
            totalStudents,
            totalPresentstudents,
            totalFormations
        });
    
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { Gethomepageinfo };