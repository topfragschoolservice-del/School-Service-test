const express = require('express');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/summary/monthly',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const match = {};
    if (month) match.month = month;
    if (year) match.year = year;

    const payments = await Payment.find(match);
    const collected = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const pending = payments.filter((payment) => payment.status !== 'paid').reduce((sum, payment) => sum + payment.amount, 0);

    res.json({ totalPayments: payments.length, collected, pending });
  })
);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const query = {};

    if (req.user.role === 'parent') {
      const students = await Student.find({ parent: req.user._id }).select('_id');
      query.student = { $in: students.map((student) => student._id) };
    }

    if (req.user.role === 'driver') {
      const students = await Student.find({ driver: req.user._id }).select('_id');
      query.student = { $in: students.map((student) => student._id) };
    }

    if (req.query.studentId) {
      query.student = req.query.studentId;
    }

    if (req.query.month) {
      query.month = Number(req.query.month);
    }

    if (req.query.year) {
      query.year = Number(req.query.year);
    }

    const payments = await Payment.find(query)
      .populate('student', 'fullName studentId grade')
      .populate('parent', 'name phone email accountId')
      .sort({ year: -1, month: -1 });

    res.json(payments);
  })
);

router.patch(
  '/:id/pay',
  protect,
  authorize('parent', 'admin'),
  asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id).populate('student');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (req.user.role === 'parent' && String(payment.parent) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    payment.status = 'paid';
    payment.method = req.body.method || 'online';
    payment.transactionId = req.body.transactionId || `TXN-${Date.now()}`;
    payment.paidAt = new Date();

    await payment.save();
    res.json(payment);
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  })
);

router.patch(
  '/:id/status',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { status, transactionId, method } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (status) payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    if (method) payment.method = method;
    payment.paidAt = status === 'paid' ? new Date() : payment.paidAt;

    await payment.save();
    res.json(payment);
  })
);

module.exports = router;
