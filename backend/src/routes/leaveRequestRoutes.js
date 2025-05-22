// backend/src/routes/leaveRequestRoutes.js
const express = require('express');
const LeaveRequest = require('../models/LeaveRequest');
const mongoose = require('mongoose');
const router = express.Router();

// Submit a leave request (personnel)
router.post('/', async (req, res) => {
  try {
    const { personnelId, startDate, endDate, reason } = req.body;

    // Validate personnelId as a valid ObjectId
    if (!personnelId || !mongoose.Types.ObjectId.isValid(personnelId)) {
      return res.status(400).json({ message: 'Invalid or missing personnelId' });
    }
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const leaveRequest = new LeaveRequest({ personnelId, startDate, endDate, reason });
    await leaveRequest.save();
    res.status(201).json({ message: 'Leave request submitted', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get all leave requests (for manager)
router.get('/', async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().populate('personnelId', 'name email');
    res.json({ leaveRequests });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Approve or deny a leave request (manager)
router.patch('/:id', async (req, res) => {
  try {
    const { status, comments } = req.body;
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, comments, reviewDate: new Date() },
      { new: true }
    );
    res.json({ message: 'Leave request updated', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;