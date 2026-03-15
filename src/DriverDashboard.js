import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import {
  fetchAssignedRoute,
  fetchAttendance,
  fetchPayments,
  fetchStudents,
  updateDriverAttendance,
} from './api';
import { formatPaymentMonth, getTodayKey } from './dateUtils';

const AttendancePage = ({ students, attendance, onUpdate, busy }) => {
  const attendanceByStudent = new Map(attendance.map((record) => [record.student?._id, record]));
  const present = attendance.filter((record) => record.morningAttendance === 'attending').length;
  const absent = attendance.filter((record) => record.morningAttendance === 'absent').length;
  const pickedUp = attendance.filter((record) => record.pickupStatus === 'picked-up').length;
  const droppedOff = attendance.filter((record) => record.dropoffStatus === 'dropped-off').length;

  return (
    <div className="sub-page">
      <h3>📋 Today's Attendance — {getTodayKey()}</h3>

      <div className="att-stats">
        <div className="att-stat blue"><span>{present}</span><small>Present</small></div>
        <div className="att-stat red"><span>{absent}</span><small>Absent</small></div>
        <div className="att-stat green"><span>{pickedUp}</span><small>Picked Up</small></div>
        <div className="att-stat orange"><span>{droppedOff}</span><small>Dropped Off</small></div>
      </div>

      <div className="att-cards">
        {students.map((student) => {
          const record = attendanceByStudent.get(student._id);
          const absentToday = record?.morningAttendance === 'absent';

          return (
            <div key={student._id} className={`att-card ${absentToday ? 'absent' : ''}`}>
              <div className="att-card-info">
                <strong>{student.fullName}</strong>
                <span>{student.grade} · {student.pickupPoint}</span>
              </div>

              <div className="att-card-actions">
                <button
                  className={`att-action-btn ${record?.pickupStatus === 'picked-up' ? 'active-green' : ''}`}
                  disabled={!record || absentToday || busy}
                  onClick={() => onUpdate(record._id, { pickupStatus: 'picked-up' })}
                >
                  🚐 {record?.pickupStatus === 'picked-up' ? 'Picked' : 'Pick Up'}
                </button>
                <button
                  className={`att-action-btn ${record?.dropoffStatus === 'dropped-off' ? 'active-blue' : ''}`}
                  disabled={!record || absentToday || record?.pickupStatus !== 'picked-up' || busy}
                  onClick={() => onUpdate(record._id, { dropoffStatus: 'dropped-off' })}
                >
                  🏠 {record?.dropoffStatus === 'dropped-off' ? 'Dropped' : 'Drop Off'}
                </button>
                <button className={`att-action-btn ${absentToday ? 'active-red' : ''}`} disabled>
                  ❌ {absentToday ? 'Absent' : record ? 'Scheduled' : 'Awaiting Parent'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RoutePage = ({ route, user }) => {
  const stops = route?.stops || [];

  return (
    <div className="sub-page">
      <h3>🗺️ My Route</h3>

      <div className="route-info-cards">
        <div className="route-meta-card"><span className="rmeta-label">Vehicle</span><span className="rmeta-value">{user?.vehicleNumber || route?.vehicleNumber || '—'}</span></div>
        <div className="route-meta-card"><span className="rmeta-label">License</span><span className="rmeta-value">{user?.licenseNumber || '—'}</span></div>
        <div className="route-meta-card"><span className="rmeta-label">Morning Departure</span><span className="rmeta-value">{route?.morningPickupTime || '—'}</span></div>
        <div className="route-meta-card"><span className="rmeta-label">Total Stops</span><span className="rmeta-value">{stops.length}</span></div>
      </div>

      <div className="route-timeline">
        <h4>Route Stops</h4>
        {stops.map((stop, index) => (
          <div key={stop} className="timeline-stop current">
            <div className="ts-marker" />
            <div className="ts-info">
              <strong>{stop}</strong>
              <span>{index === 0 ? 'Depot — Start' : index === stops.length - 1 ? 'Final Destination' : `Stop ${index}`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChildrenPage = ({ students }) => {
  const [search, setSearch] = useState('');

  const filtered = students.filter((student) =>
    student.fullName.toLowerCase().includes(search.toLowerCase()) ||
    student.pickupPoint.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sub-page">
      <h3>👥 Children List</h3>
      <input className="driver-search" placeholder="🔍 Search by name or pickup point…" value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="children-cards">
        {filtered.map((student) => (
          <div key={student._id} className="child-card">
            <div className="child-avatar">{student.fullName.charAt(0)}</div>
            <div className="child-info">
              <strong>{student.fullName}</strong>
              <span>{student.grade}</span>
              <span className="child-meta">📍 {student.pickupPoint} → {student.dropoffPoint}</span>
              <span className="child-meta">👪 {student.parent?.name || 'Parent'} · {student.parent?.phone || '—'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentPage = ({ payments }) => {
  const collected = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments.filter((payment) => payment.status !== 'paid').reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="sub-page">
      <h3>💰 Payment Status</h3>

      <div className="payment-summary-row">
        <div className="pay-sum-card green"><span>LKR {collected.toLocaleString()}</span><small>Collected</small></div>
        <div className="pay-sum-card red"><span>LKR {pending.toLocaleString()}</span><small>Pending</small></div>
      </div>

      <table className="driver-table">
        <thead><tr><th>Student</th><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.student?.fullName || '—'}</td>
              <td>{formatPaymentMonth(payment.month, payment.year)}</td>
              <td>LKR {payment.amount.toLocaleString()}</td>
              <td><span className={`dpill ${payment.status}`}>{payment.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DriverDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [route, setRoute] = useState(null);
  const [payments, setPayments] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setError('');

    try {
      const [studentList, attendanceList, assignedRoute, paymentList] = await Promise.all([
        fetchStudents(),
        fetchAttendance(`?date=${getTodayKey()}`),
        fetchAssignedRoute(),
        fetchPayments(),
      ]);

      setStudents(studentList);
      setAttendance(attendanceList);
      setRoute(assignedRoute);
      setPayments(paymentList);
    } catch (apiError) {
      setError(apiError.message || 'Failed to load driver dashboard.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAttendanceUpdate = async (attendanceId, payload) => {
    setBusy(true);
+    setError('');
    try {
      await updateDriverAttendance(attendanceId, payload);
      await loadData();
    } catch (apiError) {
      setError(apiError.message || 'Failed to update attendance.');
    } finally {
      setBusy(false);
    }
  };

  const cards = [
    { id: 'attendance', title: 'Today Attendance', icon: '📋', color: '#3498db' },
    { id: 'route', title: 'Route', icon: '🗺️', color: '#e74c3c' },
    { id: 'children', title: 'Children List', icon: '👥', color: '#2ecc71' },
    { id: 'payment', title: 'Payment', icon: '💰', color: '#f39c12' },
  ];

  const todayPresent = attendance.filter((record) => record.morningAttendance === 'attending').length;

  if (activeTab) {
    return (
      <div className="dashboard">
        <div className="dashboard-header sub-header">
          <button className="back-link" onClick={() => setActiveTab(null)}>← Dashboard</button>
        </div>
        {error && <div className="payment-alert"><p>{error}</p></div>}
        {activeTab === 'attendance' && <AttendancePage students={students} attendance={attendance} onUpdate={handleAttendanceUpdate} busy={busy} />}
        {activeTab === 'route' && <RoutePage route={route} user={user} />}
        {activeTab === 'children' && <ChildrenPage students={students} />}
        {activeTab === 'payment' && <PaymentPage payments={payments} />}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Driver Dashboard</h2>
        <p>Welcome back, {user?.name || 'Driver'}! 👋</p>
      </div>

      {error && <div className="payment-alert"><p>{error}</p></div>}

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.id} className="dashboard-card" style={{ borderTop: `5px solid ${card.color}` }} onClick={() => setActiveTab(card.id)}>
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>Tap to manage {card.title.toLowerCase()}</p>
            <button className="card-btn" style={{ background: card.color }}>View Details</button>
          </div>
        ))}
      </div>

      <div className="quick-stats">
        <h3>Today's Overview</h3>
        <div className="stats-grid">
          <div className="stat-item"><span className="stat-label">Total Students</span><span className="stat-value">{students.length}</span></div>
          <div className="stat-item"><span className="stat-label">Vehicle</span><span className="stat-value">{user?.vehicleNumber || route?.vehicleNumber || '—'}</span></div>
          <div className="stat-item"><span className="stat-label">Present Today</span><span className="stat-value">{todayPresent}</span></div>
          <div className="stat-item"><span className="stat-label">Pending Payments</span><span className="stat-value">{payments.filter((payment) => payment.status !== 'paid').length}</span></div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
