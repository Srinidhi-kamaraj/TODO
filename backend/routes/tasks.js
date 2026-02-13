const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

// Auth middleware with error handling
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).send('Invalid token');
  }
};

router.use(auth);

// GET all tasks for logged-in user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    console.error('Fetch tasks error:', err.message);
    res.status(500).send('Server error');
  }
});

// POST a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.userId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err.message);
    res.status(500).send('Server error');
  }
});

// PUT update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
  } catch (err) {
    console.error('Update task error:', err.message);
    res.status(500).send('Server error');
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) return res.status(404).send('Task not found');
    res.send('Deleted');
  } catch (err) {
    console.error('Delete task error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;