import React, { useState, useEffect } from 'react';
import './ParentDashboard.css';

/* ─────────────────────────────────────────────
   Simulated data helpers (localStorage-based)
───────────────────────────────────────────── */
const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getAttendanceHistory = () => {
  const raw = localStorage.getItem('attendanceHistory');
  return raw ? JSON.parse(raw) : {};
};

const saveAttendanceHistory = (history) => {
  localStorage.setItem('attendanceHistory', JSON.stringify(history));
};

const getNotifications = () => {
  const raw = localStorage.getItem('parentNotifications');
  if (raw) return JSON.parse(raw);
  // Default seed notifications
  return [
    { id: 1, time: '07:45 AM', message: 'Van has departed from the depot.', read: false, type: 'info' },
    { id: 2, time: '08:10 AM', message: 'Your child has been picked up successfully! 🎒', read: false, type: 'success' },
    { id: 3, time: '01:30 PM', message: 'Van is on its way back. ETA: 20 min.', read: true, type: 'info' },
    { id: 4, time: '01:52 PM', message: 'Your child has been dropped off safely! 🏠', read: true, type: 'success' },
  ];
};

const saveNotifications = (notifs) => {
  localStorage.setItem('parentNotifications', JSON.stringify(notifs));
};

const getPaymentHistory = () => {
  const raw = localStorage.getItem('paymentHistory');
  if (raw) return JSON.parse(raw);
  return [
    { id: 1, month: 'January 2026',  amount: 3500, status: 'Paid',    date: '2026-01-05' },
    { id: 2, month: 'February 2026', amount: 3500, status: 'Paid',    date: '2026-02-03' },
    { id: 3, month: 'March 2026',    amount: 3500, status: 'Pending', date: null },
  ];
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Live tracker mock */
const LiveTracker = ({ user }) => {
  const [status, setStatus] = useState('On the way to school');
  const [eta, setEta]       = useState('8 min');

  const statuses = [
    { label: 'Van departed depot',          eta: '20 min' },
    { label: 'On the way to school',        eta: '8 min'  },
    { label: 'Child picked up',             eta: '—'      },
    { label: 'Arrived at school',           eta: '—'      },
    { label: 'On the way home',             eta: '15 min' },
    { label: 'Child dropped off safely 🏠', eta: '—'      },
  ];

  return (
    <div className="tracker-panel">
      <h3>🗺️ Live Location Tracker</h3>
      <div className="map-placeholder">
        <div className="map-inner">
          <div className="van-icon">🚐</div>
          <p className="map-label">Live map coming soon (GPS integration)</p>
        </div>
      </div>

      <div className="tracker-status">
        <div className="status-badge">{status}</div>
        {eta !== '—' && <div className="eta-badge">ETA: {eta}</div>}
      </div>

      <div className="journey-steps">
        {statuses.map((s, i) => (
          <div
            key={i}
            className={`journey-step ${s.label === status ? 'active' : ''}`}
            onClick={() => { setStatus(s.label); setEta(s.eta); }}
          >
            <span className="step-dot" />
            <span className="step-text">{s.label}</span>
          </div>
        ))}
      </div>

      <p className="tracker-note">
        * Tap a step above to simulate journey progress
      </p>
    </div>
  );
};

/** Attendance marking */
const AttendancePanel = ({ user }) => {
  const today         = getTodayKey();
  const [history, setHistory] = useState(getAttendanceHistory);
  const todayRecord   = history[today];

  const mark = (morning, afternoon) => {
    const updated = {
      ...history,
      [today]: { morning, afternoon, markedAt: new Date().toLocaleTimeString() }
    };
    setHistory(updated);
    saveAttendanceHistory(updated);
  };

  const last7 = Object.entries(history)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7);

  return (
    <div className="attendance-panel">
      <h3>📋 Attendance</h3>

      <div className="attendance-today">
        <h4>Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>

        {todayRecord ? (
          <div className="attendance-confirmed">
            <p>✅ Attendance marked at {todayRecord.markedAt}</p>
            <div className="attendance-badges">
              <span className={`att-badge ${todayRecord.morning ? 'yes' : 'no'}`}>
                Morning: {todayRecord.morning ? 'Will attend' : 'Absent'}
              </span>
              <span className={`att-badge ${todayRecord.afternoon ? 'yes' : 'no'}`}>
                Afternoon: {todayRecord.afternoon ? 'Returning by van' : 'Not returning'}
              </span>
            </div>
            <button className="btn-secondary" onClick={() => {
              const updated = { ...history };
              delete updated[today];
              setHistory(updated);
              saveAttendanceHistory(updated);
            }}>
              Change
            </button>
          </div>
        ) : (
          <div className="attendance-form">
            <p className="att-prompt">Please confirm your child's attendance for today:</p>
            <div className="att-options">
              <button className="att-btn yes" onClick={() => mark(true, true)}>
                ✅ Going to school &amp; returning by van
              </button>
              <button className="att-btn partial" onClick={() => mark(true, false)}>
                🚶 Going to school, NOT returning by van
              </button>
              <button className="att-btn no" onClick={() => mark(false, false)}>
                ❌ Not attending school today
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="attendance-history">
        <h4>Recent Attendance History</h4>
        {last7.length === 0 ? (
          <p className="empty-state">No history yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr><th>Date</th><th>Morning</th><th>Afternoon</th></tr>
            </thead>
            <tbody>
              {last7.map(([date, rec]) => (
                <tr key={date}>
                  <td>{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td>{rec.morning   ? '✅' : '❌'}</td>
                  <td>{rec.afternoon ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/** Notifications */
const NotificationsPanel = () => {
  const [notifs, setNotifs] = useState(getNotifications);

  const markAllRead = () => {
    const updated = notifs.map(n => ({ ...n, read: true }));
    setNotifs(updated);
    saveNotifications(updated);
  };

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="notif-panel">
      <div className="notif-header">
        <h3>🔔 Notifications {unread > 0 && <span className="badge">{unread}</span>}</h3>
        {unread > 0 && <button className="btn-secondary" onClick={markAllRead}>Mark all read</button>}
      </div>

      <div className="notif-list">
        {notifs.length === 0 ? (
          <p className="empty-state">No notifications.</p>
        ) : (
          notifs.map(n => (
            <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'} type-${n.type}`}>
              <div className="notif-dot" />
              <div className="notif-body">
                <p className="notif-message">{n.message}</p>
                <span className="notif-time">{n.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/** Payment panel */
const PaymentPanel = () => {
  const [payments] = useState(getPaymentHistory);
  const [paying, setPaying]   = useState(false);
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry]   = useState('');
  const [cvv, setCvv]         = useState('');
  const [paid, setPaid]       = useState(false);

  const pending = payments.find(p => p.status === 'Pending');

  const handlePay = (e) => {
    e.preventDefault();
    // Simple front-end simulation — no real payment processing
    setPaid(true);
    setPaying(false);
  };

  return (
    <div className="payment-panel">
      <h3>💰 Payments</h3>

      {pending && !paid && (
        <div className="payment-alert">
          <p>⚠️ You have a pending payment for <strong>{pending.month}</strong> — LKR {pending.amount.toLocaleString()}</p>
          {!paying && (
            <button className="pay-btn" onClick={() => setPaying(true)}>Pay Now</button>
          )}
        </div>
      )}

      {paid && (
        <div className="payment-success">
          ✅ Payment for {pending?.month} was successful!
        </div>
      )}

      {paying && (
        <form className="payment-form" onSubmit={handlePay}>
          <h4>Secure Payment — LKR {pending?.amount.toLocaleString()}</h4>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNum}
              onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry</label>
              <input type="text" placeholder="MM/YY" maxLength={5} value={expiry}
                onChange={e => setExpiry(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input type="password" placeholder="•••" maxLength={3} value={cvv}
                onChange={e => setCvv(e.target.value)} required />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setPaying(false)}>Cancel</button>
            <button type="submit" className="pay-btn">Confirm Payment</button>
          </div>
        </form>
      )}

      <div className="payment-history">
        <h4>Payment History</h4>
        <table className="history-table">
          <thead>
            <tr><th>Month</th><th>Amount</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.month}</td>
                <td>LKR {p.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-pill ${p.status === 'Paid' ? 'paid' : 'pending'}`}>
                    {p.status}
                  </span>
                </td>
                <td>{p.date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** Route info panel */
const RoutePanel = ({ user }) => (
  <div className="route-panel">
    <h3>🗺️ Route Information</h3>

    <div className="route-card">
      <h4>Your Child's Route</h4>
      <div className="route-info-grid">
        <div className="route-info-item">
          <span className="route-label">Child Name</span>
          <span className="route-value">{user?.childName || 'N/A'}</span>
        </div>
        <div className="route-info-item">
          <span className="route-label">Grade</span>
          <span className="route-value">{user?.childGrade || 'N/A'}</span>
        </div>
        <div className="route-info-item">
          <span className="route-label">Pickup Point</span>
          <span className="route-value">{user?.pickupPoint || 'N/A'}</span>
        </div>
        <div className="route-info-item">
          <span className="route-label">Drop-off Point</span>
          <span className="route-value">{user?.dropoffPoint || 'N/A'}</span>
        </div>
        <div className="route-info-item">
          <span className="route-label">Morning Pickup</span>
          <span className="route-value">07:30 AM</span>
        </div>
        <div className="route-info-item">
          <span className="route-label">Afternoon Drop-off</span>
          <span className="route-value">02:00 PM</span>
        </div>
      </div>
    </div>

    <div className="route-stops">
      <h4>Route Stops (Morning)</h4>
      <ol className="stops-list">
        {['Depot', user?.pickupPoint || 'Your Stop', 'Main Junction', 'School Gate'].map((stop, i) => (
          <li key={i} className={stop === (user?.pickupPoint) ? 'your-stop' : ''}>
            {stop} {stop === user?.pickupPoint && <span className="you-badge">← You</span>}
          </li>
        ))}
      </ol>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Monthly Report panel (Parent)
───────────────────────────────────────────── */
const MonthlyReport = ({ user }) => {
  const months = [
    { month: 'March 2026',    days: 21, present: 18, absent: 3, pickedUp: 18, droppedOff: 17, feePaid: false, amount: 3500 },
    { month: 'February 2026', days: 20, present: 19, absent: 1, pickedUp: 19, droppedOff: 19, feePaid: true,  amount: 3500 },
    { month: 'January 2026',  days: 22, present: 20, absent: 2, pickedUp: 20, droppedOff: 20, feePaid: true,  amount: 3500 },
  ];

  const [selected, setSelected] = React.useState(months[0]);

  return (
    <div className="monthly-report">
      <h3>📅 Monthly Transport Report</h3>

      <div className="month-selector">
        {months.map(m => (
          <button
            key={m.month}
            className={`month-btn ${selected.month === m.month ? 'active' : ''}`}
            onClick={() => setSelected(m)}
          >
            {m.month}
          </button>
        ))}
      </div>

      <div className="report-child-info">
        <span>👧 <strong>{user?.childName || 'Your Child'}</strong></span>
        <span>{user?.childGrade || ''}</span>
      </div>

      <div className="report-stats-grid">
        <div className="report-stat blue">
          <span className="rs-value">{selected.present}</span>
          <span className="rs-label">Days Present</span>
        </div>
        <div className="report-stat red">
          <span className="rs-value">{selected.absent}</span>
          <span className="rs-label">Days Absent</span>
        </div>
        <div className="report-stat green">
          <span className="rs-value">{selected.pickedUp}</span>
          <span className="rs-label">Picked Up</span>
        </div>
        <div className="report-stat orange">
          <span className="rs-value">{selected.droppedOff}</span>
          <span className="rs-label">Dropped Off</span>
        </div>
      </div>

      <div className="report-attendance-bar">
        <div className="bar-label">
          <span>Attendance Rate</span>
          <strong>{Math.round((selected.present / selected.days) * 100)}%</strong>
        </div>
        <div className="bar-track">
          <div
            className="bar-fill"
            style={{ width: `${Math.round((selected.present / selected.days) * 100)}%` }}
          />
        </div>
      </div>

      <div className="report-payment-status">
        <span>Transport Fee — LKR {selected.amount.toLocaleString()}</span>
        <span className={`status-pill ${selected.feePaid ? 'paid' : 'pending'}`}>
          {selected.feePaid ? 'Paid' : 'Pending'}
        </span>
      </div>

      <div className="report-note">
        <p>📌 {selected.month} summary for {user?.childName || 'your child'} on route from <strong>{user?.pickupPoint || 'your stop'}</strong> to school.</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main ParentDashboard
───────────────────────────────────────────── */
const ParentDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('tracker');
  const [user, setUser]           = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('schoolVanUser');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const tabs = [
    { id: 'tracker',      label: '🗺️ Live Track',   },
    { id: 'attendance',   label: '📋 Attendance',   },
    { id: 'notifications',label: '🔔 Alerts',       },
    { id: 'payments',     label: '💰 Payments',     },
    { id: 'route',        label: '🚏 Route',        },
    { id: 'report',       label: '📅 Report',       },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'tracker':       return <LiveTracker user={user} />;
      case 'attendance':    return <AttendancePanel user={user} />;
      case 'notifications': return <NotificationsPanel />;
      case 'payments':      return <PaymentPanel />;
      case 'route':         return <RoutePanel user={user} />;
      case 'report':        return <MonthlyReport user={user} />;
      default:              return null;
    }
  };

  return (
    <div className="parent-dashboard">
      <div className="pd-header">
        <div className="pd-welcome">
          <h2>👪 Parent Dashboard</h2>
          <p>Welcome, {user?.name || 'Parent'}! Tracking {user?.childName || 'your child'}.</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="pd-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`pd-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pd-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default ParentDashboard;
