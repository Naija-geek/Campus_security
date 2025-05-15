// backend/src/models/LeaveRequest.js
const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  personnelId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  comments: { type: String },
  reviewDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);