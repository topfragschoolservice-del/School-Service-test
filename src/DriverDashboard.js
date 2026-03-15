import React, { useState, useEffect } from 'react';
import './Dashboard.css';

/* ─────────────────────────────────────────────
   Seed data
───────────────────────────────────────────── */
const STUDENTS = [
  { id: 'S001', name: 'Amal Perera',     grade: 'Grade 5', pickup: 'Maharagama',    dropoff: 'School', parent: 'Kamala Perera',   phone: '077-1234567' },
  { id: 'S002', name: 'Nimal Silva',     grade: 'Grade 3', pickup: 'Nugegoda',      dropoff: 'School', parent: 'Sunil Silva',     phone: '076-2345678' },
  { id: 'S003', name: 'Dilani Fernando', grade: 'Grade 7', pickup: 'Kottawa',       dropoff: 'School', parent: 'Ravi Fernando',   phone: '071-3456789' },
  { id: 'S004', name: 'Kasun Bandara',   grade: 'Grade 2', pickup: 'Pannipitiya',   dropoff: 'School', parent: 'Mala Bandara',    phone: '072-4567890' },
  { id: 'S005', name: 'Sanduni Gunawardena', grade: 'Grade 6', pickup: 'Boralesgamuwa', dropoff: 'School', parent: 'Priya Gunawardena', phone: '078-5678901' },
];

const getTodayKey = () => new Date().toISOString().slice(0, 10);

/* ─────────────────────────────────────────────
   Attendance sub-page
───────────────────────────────────────────── */
const AttendancePage = () => {
  const today = getTodayKey();
  const storageKey = `driverAttendance_${today}`;

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    return STUDENTS.map(s => ({ ...s, pickedUp: false, droppedOff: false, absent: false }));
  });

  const save = (updated) => {
    setRecords(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const toggle = (id, field) => {
    const updated = records.map(r => {
      if (r.id !== id) return r;
      if (field === 'absent') return { ...r, absent: !r.absent, pickedUp: false, droppedOff: false };
      return { ...r, [field]: !r[field] };
    });
    save(updated);
  };

  const present   = records.filter(r => !r.absent).length;
  const pickedUp  = records.filter(r => r.pickedUp).length;
  const droppedOff= records.filter(r => r.droppedOff).length;

  return (
    <div className="sub-page">
      <h3>📋 Today's Attendance — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>

      <div className="att-stats">
        <div className="att-stat blue"><span>{present}</span><small>Present</small></div>
        <div className="att-stat red"><span>{records.length - present}</span><small>Absent</small></div>
        <div className="att-stat green"><span>{pickedUp}</span><small>Picked Up</small></div>
        <div className="att-stat orange"><span>{droppedOff}</span><small>Dropped Off</small></div>
      </div>

      <div className="att-cards">
        {records.map(r => (
          <div key={r.id} className={`att-card ${r.absent ? 'absent' : ''}`}>
            <div className="att-card-info">
              <strong>{r.name}</strong>
              <span>{r.grade} · {r.pickup}</span>
            </div>
            <div className="att-card-actions">
              <button
                className={`att-action-btn ${r.pickedUp ? 'active-green' : ''}`}
                disabled={r.absent}
                onClick={() => toggle(r.id, 'pickedUp')}
              >
                🚐 {r.pickedUp ? 'Picked' : 'Pick Up'}
              </button>
              <button
                className={`att-action-btn ${r.droppedOff ? 'active-blue' : ''}`}
                disabled={r.absent || !r.pickedUp}
                onClick={() => toggle(r.id, 'droppedOff')}
              >
                🏠 {r.droppedOff ? 'Dropped' : 'Drop Off'}
              </button>
              <button
                className={`att-action-btn ${r.absent ? 'active-red' : ''}`}
                onClick={() => toggle(r.id, 'absent')}
              >
                ❌ {r.absent ? 'Mark Present' : 'Absent'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Route sub-page
───────────────────────────────────────────── */
const RoutePage = ({ user }) => {
  const stops = ['Depot', 'Maharagama', 'Nugegoda', 'Kottawa', 'Pannipitiya', 'Boralesgamuwa', 'School'];
  const [activeStop, setActiveStop] = useState(0);

  return (
    <div className="sub-page">
      <h3>🗺️ My Route</h3>

      <div className="route-info-cards">
        <div className="route-meta-card">
          <span className="rmeta-label">Vehicle</span>
          <span className="rmeta-value">{user?.vehicleNumber || 'CAB-1234'}</span>
        </div>
        <div className="route-meta-card">
          <span className="rmeta-label">License</span>
          <span className="rmeta-value">{user?.licenseNumber || 'B1234567'}</span>
        </div>
        <div className="route-meta-card">
          <span className="rmeta-label">Morning Departure</span>
          <span className="rmeta-value">07:00 AM</span>
        </div>
        <div className="route-meta-card">
          <span className="rmeta-label">Total Stops</span>
          <span className="rmeta-value">{stops.length}</span>
        </div>
      </div>

      <div className="route-timeline">
        <h4>Route Stops</h4>
        {stops.map((stop, i) => (
          <div
            key={i}
            className={`timeline-stop ${i === activeStop ? 'current' : ''} ${i < activeStop ? 'done' : ''}`}
            onClick={() => setActiveStop(i)}
          >
            <div className="ts-marker" />
            <div className="ts-info">
              <strong>{stop}</strong>
              <span>{i === 0 ? 'Depot — Start' : i === stops.length - 1 ? 'Final Destination' : `Stop ${i}`}</span>
            </div>
            {i === activeStop && <span className="ts-now">📍 Now</span>}
          </div>
        ))}
      </div>
      <p className="tracker-note">* Tap a stop to update your current position</p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Children list sub-page
───────────────────────────────────────────── */
const ChildrenPage = () => {
  const [search, setSearch] = useState('');

  const filtered = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.pickup.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sub-page">
      <h3>👥 Children List</h3>
      <input
        className="driver-search"
        placeholder="🔍 Search by name or pickup point…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="children-cards">
        {filtered.map(s => (
          <div key={s.id} className="child-card">
            <div className="child-avatar">{s.name.charAt(0)}</div>
            <div className="child-info">
              <strong>{s.name}</strong>
              <span>{s.grade}</span>
              <span className="child-meta">📍 {s.pickup} → {s.dropoff}</span>
              <span className="child-meta">👪 {s.parent} · {s.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Payment sub-page
───────────────────────────────────────────── */
const PaymentPage = () => {
  const payments = [
    { id:'P001', student:'Amal Perera',          month:'March 2026',    amount:3500, status:'Paid',    date:'2026-03-05' },
    { id:'P002', student:'Nimal Silva',           month:'March 2026',    amount:3500, status:'Pending', date:null },
    { id:'P003', student:'Dilani Fernando',       month:'March 2026',    amount:3500, status:'Paid',    date:'2026-03-08' },
    { id:'P004', student:'Kasun Bandara',         month:'February 2026', amount:3500, status:'Overdue', date:null },
    { id:'P005', student:'Sanduni Gunawardena',   month:'March 2026',    amount:3500, status:'Pending', date:null },
  ];

  const collected = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const pending   = payments.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="sub-page">
      <h3>💰 Payment Status</h3>

      <div className="payment-summary-row">
        <div className="pay-sum-card green">
          <span>LKR {collected.toLocaleString()}</span>
          <small>Collected</small>
        </div>
        <div className="pay-sum-card red">
          <span>LKR {pending.toLocaleString()}</span>
          <small>Pending</small>
        </div>
      </div>

      <table className="driver-table">
        <thead>
          <tr><th>Student</th><th>Month</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.student}</td>
              <td>{p.month}</td>
              <td>LKR {p.amount.toLocaleString()}</td>
              <td>
                <span className={`dpill ${p.status.toLowerCase()}`}>{p.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main DriverDashboard
───────────────────────────────────────────── */
const DriverDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('schoolVanUser');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const cards = [
    { id: 'attendance', title: 'Today Attendance', icon: '📋', color: '#3498db' },
    { id: 'route',      title: 'Route',            icon: '🗺️', color: '#e74c3c' },
    { id: 'children',   title: 'Children List',    icon: '👥', color: '#2ecc71' },
    { id: 'payment',    title: 'Payment',           icon: '💰', color: '#f39c12' },
  ];

  if (activeTab) {
    return (
      <div className="dashboard">
        <div className="dashboard-header sub-header">
          <button className="back-link" onClick={() => setActiveTab(null)}>← Dashboard</button>
        </div>
        {activeTab === 'attendance' && <AttendancePage />}
        {activeTab === 'route'      && <RoutePage user={user} />}
        {activeTab === 'children'   && <ChildrenPage />}
        {activeTab === 'payment'    && <PaymentPage />}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Driver Dashboard</h2>
        <p>Welcome back, {user?.name || 'Driver'}! 👋</p>
      </div>

      <div className="dashboard-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className="dashboard-card"
            style={{ borderTop: `5px solid ${card.color}` }}
            onClick={() => setActiveTab(card.id)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>Tap to manage {card.title.toLowerCase()}</p>
            <button className="card-btn" style={{ background: card.color }}>
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="quick-stats">
        <h3>Today's Overview</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">{STUDENTS.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Vehicle</span>
            <span className="stat-value">{user?.vehicleNumber || '—'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Experience</span>
            <span className="stat-value">{user?.experience ? user.experience + ' yr' : '—'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending Payments</span>
            <span className="stat-value">2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
