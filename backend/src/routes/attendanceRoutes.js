const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const query = {};

    if (req.query.studentId) {
      query.student = req.query.studentId;
    }

    if (req.query.date) {
      query.date = req.query.date;
    }

    if (req.user.role === 'parent') {
      const students = await Student.find({ parent: req.user._id }).select('_id');
      query.student = { $in: students.map((student) => student._id) };
    }

    if (req.user.role === 'driver') {
      const students = await Student.find({ driver: req.user._id }).select('_id');
      query.student = { $in: students.map((student) => student._id) };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'fullName studentId grade pickupPoint dropoffPoint')
      .populate('parent', 'name phone')
      .populate('driver', 'name phone')
      .sort({ date: -1, createdAt: -1 });

    res.json(attendance);
  })
);

router.post(
  '/parent-mark',
  protect,
  authorize('parent'),
  asyncHandler(async (req, res) => {
    const { studentId, date, morningAttendance, afternoonTransport, notes } = req.body;

    const student = await Student.findOne({ _id: studentId, parent: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found for this parent' });
    }

    const record = await Attendance.findOneAndUpdate(
      { student: student._id, date },
      {
        student: student._id,
        parent: req.user._id,
        driver: student.driver,
        date,
        morningAttendance,
        afternoonTransport,
        notes,
        markedByParentAt: new Date(),
        pickupStatus: morningAttendance === 'absent' ? 'skipped' : 'pending',
        dropoffStatus: morningAttendance === 'absent' || afternoonTransport === 'not-returning' ? 'skipped' : 'pending',
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (student.driver) {
      await Notification.create({
        recipient: student.driver,
        relatedStudent: student._id,
        title: 'Attendance updated',
        message: `${student.fullName} attendance was updated by parent for ${date}`,
        type: 'info',
      });
    }

    res.json(record);
  })
);

router.patch(
  '/:id/driver-status',
  protect,
  authorize('driver'),
  asyncHandler(async (req, res) => {
    const { pickupStatus, dropoffStatus, notes } = req.body;

    const record = await Attendance.findById(req.params.id).populate('student');
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (record.student.driver && String(record.student.driver) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (pickupStatus) {
      record.pickupStatus = pickupStatus;
      record.pickedUpAt = pickupStatus === 'picked-up' ? new Date() : undefined;
    }

    if (dropoffStatus) {
      record.dropoffStatus = dropoffStatus;
      record.droppedOffAt = dropoffStatus === 'dropped-off' ? new Date() : undefined;
    }

    if (notes) {
      record.notes = notes;
    }

    record.driver = req.user._id;
    await record.save();

    const student = await Student.findById(record.student._id).populate('parent');
    if (student?.parent) {
      if (pickupStatus === 'picked-up') {
        await Notification.create({
          recipient: student.parent._id,
          relatedStudent: student._id,
          title: 'Pickup confirmed',
          message: `${student.fullName} has been picked up successfully.`,
          type: 'success',
        });
      }

      if (dropoffStatus === 'dropped-off') {
        await Notification.create({
          recipient: student.parent._id,
          relatedStudent: student._id,
          title: 'Drop-off confirmed',
          message: `${student.fullName} has been dropped off safely.`,
          type: 'success',
        });
      }
    }

    res.json(record);
  })
);

module.exports = router;
