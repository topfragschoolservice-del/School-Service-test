import React, { useEffect, useState } from 'react';
import './ParentDashboard.css';
import {
  fetchAssignedRoute,
  fetchAttendance,
  fetchLatestLocation,
  fetchMyChildren,
  fetchNotifications,
  fetchParentReport,
  fetchPayments,
  markNotificationRead,
  markParentAttendance,
  payPayment,
} from './api';
import { getTodayKey, monthOptions } from './dateUtils';

const statusLabelMap = {
  pending: 'Pending',
  paid: 'Paid',
  overdue: 'Overdue',
};

const toDisplayMonth = (month, year) =>
  new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

const TrackerPanel = ({ route, location, todayAttendance }) => {
  const pickupDone = todayAttendance?.pickupStatus === 'picked-up';
  const dropoffDone = todayAttendance?.dropoffStatus === 'dropped-off';

  const steps = [
    'Van departed depot',
    pickupDone ? 'Child picked up' : 'On the way to pickup point',
    dropoffDone ? 'Child dropped off safely' : 'Journey in progress',
  ];

  return (
    <div className="tracker-panel">
      <h3>🗺️ Live Location Tracker</h3>
      <div className="map-placeholder">
        <div className="map-inner">
          <div className="van-icon">🚐</div>
          <p className="map-label">
            {location
              ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
              : 'No live location yet'}
          </p>
        </div>
      </div>

      <div className="tracker-status">
        <div className="status-badge">{dropoffDone ? 'Dropped off' : pickupDone ? 'Picked up' : 'En route'}</div>
        <div className="eta-badge">Route: {route?.name || 'Not assigned'}</div>
      </div>

      <div className="journey-steps">
        {steps.map((step) => (
          <div key={step} className="journey-step active">
            <span className="step-dot" />
            <span className="step-text">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AttendancePanel = ({ child, attendance, onMark, busy }) => {
  const today = getTodayKey();
  const todayRecord = attendance.find((item) => item.date === today);
  const recent = attendance.slice(0, 7);

  return (
    <div className="attendance-panel">
      <h3>📋 Attendance</h3>
      <div className="attendance-today">
        <h4>Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>

        {todayRecord ? (
          <div className="attendance-confirmed">
            <p>✅ Attendance submitted for {child?.fullName || 'your child'}</p>
            <div className="attendance-badges">
              <span className={`att-badge ${todayRecord.morningAttendance === 'attending' ? 'yes' : 'no'}`}>
                Morning: {todayRecord.morningAttendance === 'attending' ? 'Will attend' : 'Absent'}
              </span>
              <span className={`att-badge ${todayRecord.afternoonTransport === 'returning' ? 'yes' : 'no'}`}>
                Afternoon: {todayRecord.afternoonTransport === 'returning' ? 'Returning by van' : 'Not returning'}
              </span>
            </div>
          </div>
        ) : (
          <div className="attendance-form">
            <p className="att-prompt">Please confirm your child's attendance for today:</p>
            <div className="att-options">
              <button className="att-btn yes" disabled={busy} onClick={() => onMark('attending', 'returning')}>
                ✅ Going to school &amp; returning by van
              </button>
              <button className="att-btn partial" disabled={busy} onClick={() => onMark('attending', 'not-returning')}>
                🚶 Going to school, NOT returning by van
              </button>
              <button className="att-btn no" disabled={busy} onClick={() => onMark('absent', 'not-returning')}>
                ❌ Not attending school today
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="attendance-history">
        <h4>Recent Attendance History</h4>
        {recent.length === 0 ? (
          <p className="empty-state">No history yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr><th>Date</th><th>Morning</th><th>Afternoon</th><th>Pickup</th><th>Drop-off</th></tr>
            </thead>
            <tbody>
              {recent.map((record) => (
                <tr key={record._id}>
                  <td>{record.date}</td>
                  <td>{record.morningAttendance === 'attending' ? '✅' : '❌'}</td>
                  <td>{record.afternoonTransport === 'returning' ? '✅' : '❌'}</td>
                  <td>{record.pickupStatus === 'picked-up' ? '✅' : record.pickupStatus === 'pending' ? '⏳' : '—'}</td>
                  <td>{record.dropoffStatus === 'dropped-off' ? '✅' : record.dropoffStatus === 'pending' ? '⏳' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const NotificationsPanel = ({ notifications, onMarkAllRead }) => {
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <div className="notif-panel">
      <div className="notif-header">
        <h3>🔔 Notifications {unread > 0 && <span className="badge">{unread}</span>}</h3>
        {unread > 0 && <button className="btn-secondary" onClick={onMarkAllRead}>Mark all read</button>}
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <p className="empty-state">No notifications.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className={`notif-item ${notification.read ? 'read' : 'unread'} type-${notification.type}`}>
              <div className="notif-dot" />
              <div className="notif-body">
                <p className="notif-message">{notification.message}</p>
                <span className="notif-time">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const PaymentPanel = ({ payments, onPay, paying }) => {
  const pending = payments.find((payment) => payment.status !== 'paid');

  return (
    <div className="payment-panel">
      <h3>💰 Payments</h3>
      {pending && (
        <div className="payment-alert">
          <p>⚠️ You have a pending payment for <strong>{toDisplayMonth(pending.month, pending.year)}</strong> — LKR {pending.amount.toLocaleString()}</p>
          <button className="pay-btn" disabled={paying} onClick={() => onPay(pending._id)}>
            {paying ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      )}

      <div className="payment-history">
        <h4>Payment History</h4>
        <table className="history-table">
          <thead>
            <tr><th>Month</th><th>Amount</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{toDisplayMonth(payment.month, payment.year)}</td>
                <td>LKR {payment.amount.toLocaleString()}</td>
                <td><span className={`status-pill ${payment.status === 'paid' ? 'paid' : 'pending'}`}>{statusLabelMap[payment.status] || payment.status}</span></td>
                <td>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RoutePanel = ({ child, route }) => (
  <div className="route-panel">
    <h3>🗺️ Route Information</h3>
    <div className="route-card">
      <h4>Your Child's Route</h4>
      <div className="route-info-grid">
        <div className="route-info-item"><span className="route-label">Child Name</span><span className="route-value">{child?.fullName || 'N/A'}</span></div>
        <div className="route-info-item"><span className="route-label">Grade</span><span className="route-value">{child?.grade || 'N/A'}</span></div>
        <div className="route-info-item"><span className="route-label">Pickup Point</span><span className="route-value">{child?.pickupPoint || 'N/A'}</span></div>
        <div className="route-info-item"><span className="route-label">Drop-off Point</span><span className="route-value">{child?.dropoffPoint || 'N/A'}</span></div>
        <div className="route-info-item"><span className="route-label">Route</span><span className="route-value">{route?.name || 'N/A'}</span></div>
        <div className="route-info-item"><span className="route-label">Driver</span><span className="route-value">{route?.driver?.name || 'N/A'}</span></div>
      </div>
    </div>

    <div className="route-stops">
      <h4>Route Stops</h4>
      <ol className="stops-list">
        {(route?.stops || []).map((stop) => (
          <li key={stop} className={stop === child?.pickupPoint ? 'your-stop' : ''}>
            {stop} {stop === child?.pickupPoint && <span className="you-badge">← You</span>}
          </li>
        ))}
      </ol>
    </div>
  </div>
);

const ReportPanel = ({ report, selectedMonth, onChangeMonth }) => {
  const summary = report?.summary;
  const payment = report?.payment;

  return (
    <div className="monthly-report">
      <h3>📅 Monthly Transport Report</h3>
      <div className="month-selector">
        {monthOptions.map((option) => (
          <button key={option.label} className={`month-btn ${selectedMonth.label === option.label ? 'active' : ''}`} onClick={() => onChangeMonth(option)}>
            {option.label}
          </button>
        ))}
      </div>

      {summary ? (
        <>
          <div className="report-stats-grid">
            <div className="report-stat blue"><span className="rs-value">{summary.present}</span><span className="rs-label">Days Present</span></div>
            <div className="report-stat red"><span className="rs-value">{summary.absent}</span><span className="rs-label">Days Absent</span></div>
            <div className="report-stat green"><span className="rs-value">{summary.pickedUp}</span><span className="rs-label">Picked Up</span></div>
            <div className="report-stat orange"><span className="rs-value">{summary.droppedOff}</span><span className="rs-label">Dropped Off</span></div>
          </div>

          <div className="report-attendance-bar">
            <div className="bar-label"><span>Attendance Rate</span><strong>{summary.attendanceRate}%</strong></div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${summary.attendanceRate}%` }} /></div>
          </div>

          <div className="report-payment-status">
            <span>Transport Fee</span>
            <span className={`status-pill ${payment?.status === 'paid' ? 'paid' : 'pending'}`}>
              {payment ? statusLabelMap[payment.status] || payment.status : 'No payment record'}
            </span>
          </div>
        </>
      ) : (
        <p className="empty-state">No report data available.</p>
      )}
    </div>
  );
};

const ParentDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('tracker');
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[2]);
  const [child, setChild] = useState(null);
  const [route, setRoute] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [report, setReport] = useState(null);
  const [location, setLocation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = async (month = selectedMonth) => {
    setError('');

    try {
      const [children, notificationList, paymentList, assignedRoute] = await Promise.all([
        fetchMyChildren(),
        fetchNotifications(),
        fetchPayments(),
        fetchAssignedRoute(),
      ]);

      const primaryChild = children[0] || null;
      setChild(primaryChild);
      setNotifications(notificationList);
      setPayments(paymentList);
      setRoute(assignedRoute);

      if (primaryChild) {
        const [attendanceList, reportData] = await Promise.all([
          fetchAttendance(`?studentId=${primaryChild._id}`),
          fetchParentReport(primaryChild._id, month.month, month.year),
        ]);
        setAttendance(attendanceList);
        setReport(reportData);
      }

      if (assignedRoute?.driver?._id) {
        const latestLocation = await fetchLatestLocation(assignedRoute.driver._id);
        setLocation(latestLocation);
      } else {
        setLocation(null);
      }
    } catch (apiError) {
      setError(apiError.message || 'Failed to load dashboard.');
    }
  };

  useEffect(() => {
    loadDashboard(selectedMonth);
  }, [selectedMonth.label]);

  const handleAttendanceMark = async (morningAttendance, afternoonTransport) => {
    if (!child) {
      return;
    }

    setBusy(true);
    try {
      await markParentAttendance({
        studentId: child._id,
        date: getTodayKey(),
        morningAttendance,
        afternoonTransport,
      });
      await loadDashboard(selectedMonth);
    } catch (apiError) {
      setError(apiError.message || 'Failed to mark attendance.');
    } finally {
      setBusy(false);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((item) => !item.read);
    await Promise.all(unread.map((item) => markNotificationRead(item._id)));
    await loadDashboard(selectedMonth);
  };

  const handlePay = async (paymentId) => {
    setBusy(true);
    try {
      await payPayment(paymentId, { method: 'online' });
      await loadDashboard(selectedMonth);
    } catch (apiError) {
      setError(apiError.message || 'Payment failed.');
    } finally {
      setBusy(false);
    }
  };

  const tabs = [
    { id: 'tracker', label: '🗺️ Live Track' },
    { id: 'attendance', label: '📋 Attendance' },
    { id: 'notifications', label: '🔔 Alerts' },
    { id: 'payments', label: '💰 Payments' },
    { id: 'route', label: '🚏 Route' },
    { id: 'report', label: '📅 Report' },
  ];

  const todayAttendance = attendance.find((item) => item.date === getTodayKey());

  const renderTab = () => {
    switch (activeTab) {
      case 'tracker':
        return <TrackerPanel route={route} location={location} todayAttendance={todayAttendance} />;
      case 'attendance':
        return <AttendancePanel child={child} attendance={attendance} onMark={handleAttendanceMark} busy={busy} />;
      case 'notifications':
        return <NotificationsPanel notifications={notifications} onMarkAllRead={handleMarkAllRead} />;
      case 'payments':
        return <PaymentPanel payments={payments} onPay={handlePay} paying={busy} />;
      case 'route':
        return <RoutePanel child={child} route={route} />;
      case 'report':
        return <ReportPanel report={report} selectedMonth={selectedMonth} onChangeMonth={setSelectedMonth} />;
      default:
        return null;
    }
  };

  return (
    <div className="parent-dashboard">
      <div className="pd-header">
        <div className="pd-welcome">
          <h2>👪 Parent Dashboard</h2>
          <p>Welcome, {user?.name || 'Parent'}! Tracking {child?.fullName || user?.childName || 'your child'}.</p>
        </div>
      </div>

      {error && <div className="payment-alert"><p>{error}</p></div>}

      <div className="pd-tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={`pd-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pd-content">{renderTab()}</div>
    </div>
  );
};

export default ParentDashboard;
