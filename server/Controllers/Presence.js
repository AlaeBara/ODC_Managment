const Course = require('../Models/courseModel')
const Candidate =require('../Models/candidateModel')

const GetPresencedata = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the course/formation by id
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: 'Formation not found' });
        }

        // Find all candidates related to the formation (by id_Formation)
        const candidates = await Candidate.find({ id_Formation: id });

        res.status(200).json({
            formation: course, // Formation information
            candidates: candidates // All candidate info
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data', error });
    }
};

module.exports = { GetPresencedata };