// backend/src/models/DutyAssignment.js
const mongoose = require('mongoose');

const DutyAssignmentSchema = new mongoose.Schema({
  personnelId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dutyPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'DutyPost', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  shifts: [{ type: String, enum: ['morning', 'evening', 'night'] }]
}, { timestamps: true });

module.exports = mongoose.model('DutyAssignment', DutyAssignmentSchema);