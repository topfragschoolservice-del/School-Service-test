const express = require('express');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/parent/monthly/:studentId',
  protect,
  authorize('parent', 'admin'),
  asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const student = await Student.findById(studentId).populate('parent route driver');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'parent' && String(student.parent._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const attendance = await Attendance.find({ student: studentId });
    const filteredAttendance = attendance.filter((record) => {
      const recordDate = new Date(record.date);
      const sameMonth = !month || recordDate.getMonth() + 1 === month;
      const sameYear = !year || recordDate.getFullYear() === year;
      return sameMonth && sameYear;
    });

    const payment = await Payment.findOne({ student: studentId, month, year });

    const present = filteredAttendance.filter((item) => item.morningAttendance === 'attending').length;
    const absent = filteredAttendance.filter((item) => item.morningAttendance === 'absent').length;
    const pickedUp = filteredAttendance.filter((item) => item.pickupStatus === 'picked-up').length;
    const droppedOff = filteredAttendance.filter((item) => item.dropoffStatus === 'dropped-off').length;

    res.json({
      student: {
        id: student._id,
        studentId: student.studentId,
        fullName: student.fullName,
        grade: student.grade,
        pickupPoint: student.pickupPoint,
        dropoffPoint: student.dropoffPoint,
      },
      summary: {
        totalDays: filteredAttendance.length,
        present,
        absent,
        pickedUp,
        droppedOff,
        attendanceRate: filteredAttendance.length ? Math.round((present / filteredAttendance.length) * 100) : 0,
      },
      payment,
    });
  })
);

router.get(
  '/admin/monthly',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const students = await Student.find();
    const attendance = await Attendance.find();
    const payments = await Payment.find(month && year ? { month, year } : {});

    const filteredAttendance = attendance.filter((record) => {
      if (!month || !year) {
        return true;
      }

      const recordDate = new Date(record.date);
      return recordDate.getMonth() + 1 === month && recordDate.getFullYear() === year;
    });

    const present = filteredAttendance.filter((item) => item.morningAttendance === 'attending').length;
    const collected = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const pending = payments.filter((payment) => payment.status !== 'paid').reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      totalStudents: students.length,
      attendanceRecords: filteredAttendance.length,
      attendanceRate: filteredAttendance.length ? Math.round((present / filteredAttendance.length) * 100) : 0,
      collected,
      pending,
    });
  })
);

module.exports = router;
