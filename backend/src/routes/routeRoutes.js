const express = require('express');
const Route = require('../models/Route');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/assigned/me',
  protect,
  asyncHandler(async (req, res) => {
    if (req.user.role === 'driver') {
      const route = await Route.findOne({ driver: req.user._id }).populate('driver', 'name phone accountId');
      return res.json(route);
    }

    if (req.user.role === 'parent') {
      const student = await Student.findOne({ parent: req.user._id }).populate({
        path: 'route',
        populate: { path: 'driver', select: 'name phone accountId' },
      });
      return res.json(student?.route || null);
    }

    return res.status(400).json({ message: 'This endpoint is for parent or driver accounts' });
  })
);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const routes = await Route.find().populate('driver', 'name phone accountId driverProfile');
    res.json(routes);
  })
);

router.post(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  })
);

router.patch(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json(route);
  })
);

module.exports = router;
