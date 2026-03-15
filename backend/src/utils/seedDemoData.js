const User = require('../models/User');
const Route = require('../models/Route');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const VehicleLocation = require('../models/VehicleLocation');

const seedDemoData = async () => {
  const hasUsers = await User.countDocuments();
  if (hasUsers > 0) {
    return;
  }

  const admin = await User.create({
    name: 'Admin User',
    accountId: 'admin1',
    phone: '0771234567',
    email: 'admin@schoolvan.test',
    role: 'admin',
    password: 'admin123',
  });

  const driverA = await User.create({
    name: 'Suresh Kumar',
    accountId: 'driver1',
    phone: '0779876543',
    email: 'suresh@schoolvan.test',
    role: 'driver',
    password: 'driver123',
    driverProfile: {
      licenseNumber: 'B1234567',
      vehicleNumber: 'CAB-1234',
      experience: 8,
    },
  });

  const driverB = await User.create({
    name: 'Priya Rathnayake',
    accountId: 'driver2',
    phone: '0768765432',
    email: 'priya@schoolvan.test',
    role: 'driver',
    password: 'driver123',
    driverProfile: {
      licenseNumber: 'B9876543',
      vehicleNumber: 'CAB-5678',
      experience: 5,
    },
  });

  const routeA = await Route.create({
    name: 'Route A',
    driver: driverA._id,
    vehicleNumber: 'CAB-1234',
    stops: ['Depot', 'Maharagama', 'Kottawa', 'Pannipitiya', 'School'],
    morningPickupTime: '07:00 AM',
    afternoonDropoffTime: '02:00 PM',
  });

  const routeB = await Route.create({
    name: 'Route B',
    driver: driverB._id,
    vehicleNumber: 'CAB-5678',
    stops: ['Depot', 'Nugegoda', 'Kohuwala', 'Boralesgamuwa', 'School'],
    morningPickupTime: '07:10 AM',
    afternoonDropoffTime: '02:10 PM',
  });

  const parentA = await User.create({
    name: 'Kamala Perera',
    accountId: 'parent1',
    phone: '0771112233',
    email: 'kamala@schoolvan.test',
    role: 'parent',
    password: 'parent123',
    parentProfile: {
      childName: 'Amal Perera',
      childGrade: 'Grade 5',
      pickupPoint: 'Maharagama',
      dropoffPoint: 'School',
    },
  });

  const parentB = await User.create({
    name: 'Sunil Silva',
    accountId: 'parent2',
    phone: '0762223344',
    email: 'sunil@schoolvan.test',
    role: 'parent',
    password: 'parent123',
    parentProfile: {
      childName: 'Nimal Silva',
      childGrade: 'Grade 3',
      pickupPoint: 'Nugegoda',
      dropoffPoint: 'School',
    },
  });

  const studentA = await Student.create({
    studentId: 'STU-parent1',
    fullName: 'Amal Perera',
    grade: 'Grade 5',
    parent: parentA._id,
    driver: driverA._id,
    route: routeA._id,
    pickupPoint: 'Maharagama',
    dropoffPoint: 'School',
    monthlyFee: 3500,
  });

  const studentB = await Student.create({
    studentId: 'STU-parent2',
    fullName: 'Nimal Silva',
    grade: 'Grade 3',
    parent: parentB._id,
    driver: driverB._id,
    route: routeB._id,
    pickupPoint: 'Nugegoda',
    dropoffPoint: 'School',
    monthlyFee: 3500,
  });

  await Attendance.insertMany([
    {
      student: studentA._id,
      parent: parentA._id,
      driver: driverA._id,
      date: '2026-03-15',
      morningAttendance: 'attending',
      afternoonTransport: 'returning',
      pickupStatus: 'picked-up',
      dropoffStatus: 'pending',
      markedByParentAt: new Date('2026-03-15T06:30:00.000Z'),
      pickedUpAt: new Date('2026-03-15T07:40:00.000Z'),
    },
    {
      student: studentA._id,
      parent: parentA._id,
      driver: driverA._id,
      date: '2026-03-14',
      morningAttendance: 'attending',
      afternoonTransport: 'returning',
      pickupStatus: 'picked-up',
      dropoffStatus: 'dropped-off',
      markedByParentAt: new Date('2026-03-14T06:30:00.000Z'),
      pickedUpAt: new Date('2026-03-14T07:35:00.000Z'),
      droppedOffAt: new Date('2026-03-14T13:55:00.000Z'),
    },
    {
      student: studentB._id,
      parent: parentB._id,
      driver: driverB._id,
      date: '2026-03-15',
      morningAttendance: 'attending',
      afternoonTransport: 'not-returning',
      pickupStatus: 'pending',
      dropoffStatus: 'skipped',
      markedByParentAt: new Date('2026-03-15T06:40:00.000Z'),
    },
  ]);

  await Payment.insertMany([
    {
      student: studentA._id,
      parent: parentA._id,
      month: 1,
      year: 2026,
      amount: 3500,
      status: 'paid',
      method: 'online',
      transactionId: 'TXN-1001',
      paidAt: new Date('2026-01-05T10:15:00.000Z'),
    },
    {
      student: studentA._id,
      parent: parentA._id,
      month: 2,
      year: 2026,
      amount: 3500,
      status: 'paid',
      method: 'online',
      transactionId: 'TXN-1002',
      paidAt: new Date('2026-02-03T10:15:00.000Z'),
    },
    {
      student: studentA._id,
      parent: parentA._id,
      month: 3,
      year: 2026,
      amount: 3500,
      status: 'pending',
      method: 'online',
    },
    {
      student: studentB._id,
      parent: parentB._id,
      month: 3,
      year: 2026,
      amount: 3500,
      status: 'overdue',
      method: 'online',
    },
  ]);

  await Notification.insertMany([
    {
      recipient: parentA._id,
      relatedStudent: studentA._id,
      title: 'Van departed',
      message: 'Van has departed from the depot.',
      type: 'info',
    },
    {
      recipient: parentA._id,
      relatedStudent: studentA._id,
      title: 'Pickup confirmed',
      message: 'Amal Perera has been picked up successfully.',
      type: 'success',
    },
    {
      recipient: driverA._id,
      relatedStudent: studentA._id,
      title: 'Attendance updated',
      message: 'Amal Perera attendance was updated by parent for 2026-03-15',
      type: 'info',
    },
  ]);

  await VehicleLocation.create({
    driver: driverA._id,
    route: routeA._id,
    latitude: 6.8467,
    longitude: 79.9482,
    speed: 32,
    heading: 180,
  });

  console.log('Demo backend data seeded');
  console.log('Demo accounts: parent1 / 0771112233, driver1 / 0779876543, admin1 / 0771234567');
};

module.exports = seedDemoData;
