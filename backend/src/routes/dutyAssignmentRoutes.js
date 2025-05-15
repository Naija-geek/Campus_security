// backend/src/routes/dutyAssignmentRoutes.js
const express = require('express');
const DutyAssignment = require('../models/DutyAssignment');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { personnelId, dutyPostId, startDate, endDate, shifts } = req.body;
    const assignment = new DutyAssignment({ personnelId, dutyPostId, startDate, endDate, shifts });
    await assignment.save();
    res.status(201).json({ message: 'Duty assigned successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;