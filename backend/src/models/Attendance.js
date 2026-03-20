const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: String,
      required: true,
    },
    morningAttendance: {
      type: String,
      enum: ['attending', 'absent'],
      default: 'attending',
    },
    afternoonTransport: {
      type: String,
      enum: ['returning', 'not-returning'],
      default: 'returning',
    },
    pickupStatus: {
      type: String,
      enum: ['pending', 'picked-up', 'skipped'],
      default: 'pending',
    },
    dropoffStatus: {
      type: String,
      enum: ['pending', 'dropped-off', 'skipped'],
      default: 'pending',
    },
    markedByParentAt: Date,
    pickedUpAt: Date,
    droppedOffAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
