const Candidate = require('../Models/candidateModel');
const Courses = require('../Models/courseModel')


const NumberOfCandidatesConfirmer = async (req, res) => {
    try {
  
      const results = await Candidate.aggregate([
        {
          $match: {
            presenceState: true // Only count candidates with presenceState true
          }
        },
        {
          $group: {
            _id: "$id_Formation", // Group by formation ID
            numberOfCandidates: { $sum: 1 } // Count the candidates in each formation
          }
        }
      ]);
  
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching number of candidates:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

const NumberOfCandidatesPresence = async (req, res) => {
    try {
      // Get the current date to compare with the course end date
      const currentDate = new Date();
  
      // Fetch courses that have ended
      const courses = await Courses.find({ endDate: { $lt: currentDate } });
  
      // Loop over each course to calculate the number of candidates present
      const results = await Promise.all(courses.map(async (course) => {
        const totalSessions = course.endDate.getDate() - course.startDate.getDate() + 1;
  
        // Aggregate candidates who attended more than 50% of the sessions
        const candidates = await Candidate.aggregate([
          {
            $match: {
              id_Formation: course._id
            }
          },
          {
            $addFields: {
              // Calculate the number of attended sessions
              totalPresence: {
                $sum: {
                  $map: {
                    input: "$sessions",
                    as: "session",
                    in: {
                      $cond: [
                        {
                          $or: [
                            { $eq: ["$$session.morningStatus", "Present"] },
                            { $eq: ["$$session.afternoonStatus", "Present"] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  }
                }
              }
            }
          },
          {
            $addFields: {
              presenceRate: { $divide: ["$totalPresence", totalSessions] }
            }
          },
          {
            $match: {
              presenceRate: { $gt: 0.5 } // Filter candidates with more than 50% presence
            }
          },
          {
            $group: {
              _id: "$id_Formation", // Group by formation ID
              numberOfCandidates: { $sum: 1 } // Count the candidates present
            }
          }
        ]);
  
        return {
          courseTitle: course.title,        // Return course title
          id_Formation: course._id,         // Return formation ID
          numberOfCandidates: candidates.length > 0 ? candidates[0].numberOfCandidates : 0 // Handle no candidates case
        };
      }));
  
      res.status(200).json(results);
    } catch (error) {
      console.error('Error calculating candidate presence:', error);
      res.status(500).json({ message: 'Server error' });
    }
};
  
  



module.exports = {NumberOfCandidatesConfirmer,NumberOfCandidatesPresence};
