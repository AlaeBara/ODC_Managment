const express = require('express');
const router = express.Router();
const Course = require('../Models/courseModel');  // Correctly import the Course model

///////////////////////////////////////////////////////////////////////////////////////
const AddFormation = async (req, res) => {
  const { title, description, startDate, endDate, mentors, tags, schedule } = req.body;

  try {
    const newCourse = new Course({  // Use the Course model, not CourseSchema
      title,
      description,
      startDate,
      endDate,
      mentors,
      tags,
      schedule,
    });

    await newCourse.save();

    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};


////////////////////////////////////////////////////////////////////////////////////////
const GetFormations = async (req, res) => {
  try {
    const courses = await Course.find().populate('mentors');  // Use the Course model
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};


////////////////////////////////////////////////////////////////////////////////////////
const GetOneFormations = async (req, res) => {

  const { id } = req.params;

  try {
    const course = await Course.findById(id).populate('mentors');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

module.exports = { AddFormation, GetFormations };