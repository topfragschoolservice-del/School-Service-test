const express = require('express');
const VehicleLocation = require('../models/VehicleLocation');
const Route = require('../models/Route');
const asyncHandler = require('../utils/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/location',
  protect,
  authorize('driver'),
  asyncHandler(async (req, res) => {
    const route = await Route.findOne({ driver: req.user._id });
    const location = await VehicleLocation.create({
      driver: req.user._id,
      route: route?._id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      speed: req.body.speed,
      heading: req.body.heading,
    });

    res.status(201).json(location);
  })
);

router.get(
  '/location/:driverId',
  protect,
  asyncHandler(async (req, res) => {
    const latest = await VehicleLocation.findOne({ driver: req.params.driverId })
      .sort({ recordedAt: -1 })
      .populate('route', 'name stops');

    res.json(latest);
  })
);

module.exports = router;
