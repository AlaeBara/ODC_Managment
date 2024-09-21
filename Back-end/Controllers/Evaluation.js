const Course = require('../Models/courseModel');
const Evaluation = require('../Models/evaluationModel');

////////////////////////////////////////////////////////////////////////////////////////

const SubmitEvaluation = async (req, res) => {
  const { 
    courseId, mentorId, contentQuality, acquiredSkillsQuality, alignmentWithNeeds,
    trainingStructure, difficultyLevel, trainerPedagogyQuality, trainerExpertise,
    materialQuality, exercisesQuality, adaptationToParticipants, roomComfort,
    accessibility, timingAndBreaks, equipmentCondition, organizationalCommunication,
    administrativeManagement, groupComposition, trainingDuration, recommendation,
    generalComments
  } = req.body;

  try {
    const newEvaluation = new Evaluation({
      courseId,
      mentorId,
      contentQuality,
      acquiredSkillsQuality,
      alignmentWithNeeds,
      trainingStructure,
      difficultyLevel,
      trainerPedagogyQuality,
      trainerExpertise,
      materialQuality,
      exercisesQuality,
      adaptationToParticipants,
      roomComfort,
      accessibility,
      timingAndBreaks,
      equipmentCondition,
      organizationalCommunication,
      administrativeManagement,
      groupComposition,
      trainingDuration,
      recommendation,
      generalComments
    });

    await newEvaluation.save();

    res.status(200).json({ message: 'Evaluation submitted successfully', evaluation: newEvaluation });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting evaluation', error: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////
//Api For Generate Evaluation Link

const GenerateEvaluationLink = async (req, res) => {
  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Generate a unique token (you might want to use a more sophisticated method)
    const token = Math.random().toString(36).substr(2, 10);

    // In a real-world scenario, you'd store this token securely, possibly in a separate collection
    // For this example, we'll just return it
    const evaluationLink = `${process.env.FRONTEND_URL}/evaluation/${courseId}?token=${token}`;

    res.status(200).json({ evaluationLink });
  } catch (error) {
    res.status(500).json({ message: 'Error generating evaluation link', error: error.message });
  }
};

module.exports = { SubmitEvaluation, GenerateEvaluationLink };