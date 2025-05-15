// backend/src/routes/personnelRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Only fetch personnel users, or all users as needed
    const personnel = await User.find({ role: 'personnel' }); // or remove filter for all
    res.json({ personnel });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;