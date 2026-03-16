const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// Get all courses (public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single course (public)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create course (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update course (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete course (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enroll in course (logged in user)
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.enrolledCourses.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }
    user.enrolledCourses.push(req.params.id);
    await user.save();

    await Course.findByIdAndUpdate(req.params.id, { $inc: { students: 1 } });
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get enrolled courses (logged in user)
router.get('/user/enrolled', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses');
    res.json(user.enrolledCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;