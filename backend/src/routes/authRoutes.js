const express = require('express');
const User = require('../models/User');
const Student = require('../models/Student');
const Route = require('../models/Route');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');

const router = express.Router();

const normalizePhone = (value = '') => value.replace(/[-\s]/g, '');

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const {
      name,
      id,
      accountId,
      email,
      phone,
      password,
      address,
      role,
      licenseNumber,
      vehicleNumber,
      experience,
      childName,
      childGrade,
      pickupPoint,
      dropoffPoint,
      adminCode,
      routeId,
    } = req.body;

    const finalAccountId = accountId || id;

    if (!name || !finalAccountId || !phone || !role) {
      return res.status(400).json({ message: 'name, id/accountId, phone, and role are required' });
    }

    if (!['parent', 'driver', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (role === 'admin' && adminCode !== (process.env.ADMIN_ACCESS_CODE || 'ADMIN2026')) {
      return res.status(403).json({ message: 'Invalid admin access code' });
    }

    const existingUser = await User.findOne({ accountId: finalAccountId });
    if (existingUser) {
      return res.status(409).json({ message: 'Account ID already exists' });
    }

    const userData = {
      name,
      accountId: finalAccountId,
      email,
      phone,
      password,
      address,
      role,
    };

    if (role === 'driver') {
      userData.driverProfile = {
        licenseNumber,
        vehicleNumber,
        experience: experience ? Number(experience) : undefined,
      };
    }

    if (role === 'parent') {
      userData.parentProfile = {
        childName,
        childGrade,
        pickupPoint,
        dropoffPoint,
      };
    }

    const user = await User.create(userData);

    if (role === 'parent' && childName && childGrade) {
      let assignedRoute = null;
      if (routeId) {
        assignedRoute = await Route.findById(routeId);
      }

      await Student.create({
        studentId: `STU-${finalAccountId}`,
        fullName: childName,
        grade: childGrade,
        parent: user._id,
        driver: assignedRoute?.driver,
        route: assignedRoute?._id,
        pickupPoint,
        dropoffPoint,
      });
    }

    const token = generateToken({ userId: user._id, role: user.role });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        accountId: user.accountId,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
      },
    });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { accountId, id, role, password, phone } = req.body;
    const finalAccountId = accountId || id;

    if (!finalAccountId || !role) {
      return res.status(400).json({ message: 'accountId/id and role are required' });
    }

    const user = await User.findOne({ accountId: finalAccountId, role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let valid = false;

    if (password && user.password) {
      valid = await user.matchPassword(password);
    } else if (phone) {
      valid = normalizePhone(user.phone) === normalizePhone(phone);
    }

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user._id, role: user.role });

    res.json({
      token,
      user: {
        id: user._id,
        accountId: user.accountId,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        driverProfile: user.driverProfile,
        parentProfile: user.parentProfile,
      },
    });
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  })
);

module.exports = router;
