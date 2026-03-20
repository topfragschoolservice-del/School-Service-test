const express = require('express');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('relatedStudent', 'fullName studentId')
      .sort({ createdAt: -1 });

    res.json(notifications);
  })
);

router.post(
  '/',
  protect,
  authorize('admin', 'driver'),
  asyncHandler(async (req, res) => {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  })
);

router.patch(
  '/:id/read',
  protect,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req.params.id, recipient: req.user._id });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  })
);

module.exports = router;
