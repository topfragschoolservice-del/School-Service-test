const express = require('express');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/my-child',
  protect,
  authorize('parent'),
  asyncHandler(async (req, res) => {
    const students = await Student.find({ parent: req.user._id }).populate('route driver', 'name accountId phone driverProfile');
    res.json(students);
  })
);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const query = {};

    if (req.user.role === 'parent') {
      query.parent = req.user._id;
    }

    if (req.user.role === 'driver') {
      query.driver = req.user._id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.routeId) {
      query.route = req.query.routeId;
    }

    const students = await Student.find(query)
      .populate('parent', 'name phone email accountId')
      .populate('driver', 'name phone accountId driverProfile')
      .populate('route', 'name stops vehicleNumber');

    res.json(students);
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  })
);

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)
      .populate('parent', 'name phone email accountId')
      .populate('driver', 'name phone accountId')
      .populate('route', 'name stops vehicleNumber');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'parent' && String(student.parent._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.user.role === 'driver' && student.driver && String(student.driver._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(student);
  })
);

router.patch(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  })
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted' });
  })
);

module.exports = router;
