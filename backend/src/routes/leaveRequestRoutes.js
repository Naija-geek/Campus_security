// backend/src/routes/leaveRequestRoutes.js
const express = require('express');
const LeaveRequest = require('../models/LeaveRequest');
const mongoose = require('mongoose');
const router = express.Router();

// Personnel submits a leave request
router.post('/', async (req, res) => {
  const { personnelId, startDate, endDate, reason } = req.body;
  const leaveRequest = await LeaveRequest.create({ personnelId, startDate, endDate, reason });
  res.json({ leaveRequest });
});

// Manager fetches all leave requests
router.get('/', async (req, res) => {
  try {
    const { personnelId } = req.query;
    let query = {};
    if (personnelId) query.personnelId = new mongoose.Types.ObjectId(personnelId);
    const requests = await LeaveRequest.find(query);
    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manager approves/rejects a request
router.patch('/:id', async (req, res) => {
  const { status, comments } = req.body;
  const leaveRequest = await LeaveRequest.findByIdAndUpdate(
    req.params.id,
    { status, reviewDate: new Date(), comments },
    { new: true }
  );
  res.json({ leaveRequest });
});

module.exports = router;