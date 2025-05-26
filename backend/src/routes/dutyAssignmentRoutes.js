// backend/src/routes/dutyAssignmentRoutes.js
const express = require('express');
const DutyAssignment = require('../models/DutyAssignment');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { personnelId, dutyPostId, startDate, endDate, shifts } = req.body;
    const assignment = await DutyAssignment.create({
      personnelId,
      dutyPostId,
      startDate,
      endDate,
      shifts,
      assignedBy: req.session.userId // or req.user._id if using JWT
    });
    res.json({ assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assignments for a personnel
router.get('/personnel/:personnelId', async (req, res) => {
  try {
    const assignments = await DutyAssignment.find({ personnelId: req.params.personnelId })
      .populate('dutyPostId');
    res.json({ assignments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;