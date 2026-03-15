import React, { useState } from 'react';
import './AdminDashboard.css';

/* ─────────────────────────────────────────────
   Seed / helper data
───────────────────────────────────────────── */
const SEED_STUDENTS = [
  { id: 'S001', name: 'Amal Perera',    grade: 'Grade 5', route: 'Route A', parent: 'Kamala Perera',   phone: '077-1234567', fee: 3500, status: 'Active' },
  { id: 'S002', name: 'Nimal Silva',    grade: 'Grade 3', route: 'Route B', parent: 'Sunil Silva',     phone: '076-2345678', fee: 3500, status: 'Active' },
  { id: 'S003', name: 'Dilani Fernando',grade: 'Grade 7', route: 'Route A', parent: 'Ravi Fernando',   phone: '071-3456789', fee: 3500, status: 'Active' },
  { id: 'S004', name: 'Kasun Bandara',  grade: 'Grade 2', route: 'Route C', parent: 'Mala Bandara',    phone: '072-4567890', fee: 3500, status: 'Inactive'},
];

const SEED_DRIVERS = [
  { id: 'D001', name: 'Suresh Kumar',   phone: '077-9876543', license: 'B1234567', vehicle: 'CAB-1234', route: 'Route A', experience: 8,  status: 'Active'  },
  { id: 'D002', name: 'Priya Rathnayake',phone:'076-8765432', license: 'B9876543', vehicle: 'CAB-5678', route: 'Route B', experience: 5,  status: 'Active'  },
  { id: 'D003', name: 'Roshan Mendis',  phone: '075-7654321', license: 'B5554433', vehicle: 'CAB-9012', route: 'Route C', experience: 12, status: 'Active'  },
];

const SEED_ROUTES = [
  { id: 'RA', name: 'Route A', stops: ['Depot', 'Maharagama', 'Kottawa', 'Pannipitiya', 'School'], driver: 'Suresh Kumar',    students: 12, distance: '18 km' },
  { id: 'RB', name: 'Route B', stops: ['Depot', 'Nugegoda', 'Kohuwala', 'Boralesgamuwa', 'School'], driver: 'Priya Rathnayake', students: 10, distance: '14 km' },
  { id: 'RC', name: 'Route C', stops: ['Depot', 'Piliyandala', 'Kesbewa', 'Bandaragama', 'School'], driver: 'Roshan Mendis',    students: 8,  distance: '22 km' },
];

const SEED_PAYMENTS = [
  { id: 'P001', student: 'Amal Perera',     month: 'March 2026',    amount: 3500, status: 'Paid',    date: '2026-03-05' },
  { id: 'P002', student: 'Nimal Silva',     month: 'March 2026',    amount: 3500, status: 'Pending', date: null },
  { id: 'P003', student: 'Dilani Fernando', month: 'March 2026',    amount: 3500, status: 'Paid',    date: '2026-03-08' },
  { id: 'P004', student: 'Kasun Bandara',   month: 'February 2026', amount: 3500, status: 'Overdue', date: null },
  { id: 'P005', student: 'Amal Perera',     month: 'February 2026', amount: 3500, status: 'Paid',    date: '2026-02-04' },
  { id: 'P006', student: 'Nimal Silva',     month: 'February 2026', amount: 3500, status: 'Paid',    date: '2026-02-07' },
];

const SEED_ATTENDANCE = (() => {
  const days = ['2026-03-09','2026-03-10','2026-03-11','2026-03-12','2026-03-13'];
  const rows = [];
  SEED_STUDENTS.forEach(s => {
    days.forEach(d => {
      rows.push({ student: s.name, date: d, morning: Math.random() > 0.15, afternoon: Math.random() > 0.2 });
    });
  });
  return rows;
})();

/* ─────────────────────────────────────────────
   Sub-panels
───────────────────────────────────────────── */

/* Overview */
const Overview = ({ students, drivers, payments }) => {
  const totalRevenue  = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);

  const stats = [
    { label: 'Total Students', value: students.length,                        icon: '👧', color: '#3498db' },
    { label: 'Active Drivers',  value: drivers.filter(d=>d.status==='Active').length, icon: '🚐', color: '#2ecc71' },
    { label: 'Revenue (Mar)',   value: `LKR ${totalRevenue.toLocaleString()}`, icon: '💰', color: '#f39c12' },
    { label: 'Pending Fees',    value: `LKR ${pendingAmount.toLocaleString()}`,icon: '⚠️', color: '#e74c3c' },
  ];

  return (
    <div className="overview-panel">
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i} style={{ borderTop: `5px solid ${s.color}` }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="overview-sections">
        <div className="overview-section">
          <h4>Recent Payments</h4>
          <table className="admin-table">
            <thead><tr><th>Student</th><th>Month</th><th>Status</th></tr></thead>
            <tbody>
              {payments.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td>{p.student}</td>
                  <td>{p.month}</td>
                  <td><span className={`status-pill ${p.status.toLowerCase()}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overview-section">
          <h4>Driver Status</h4>
          <table className="admin-table">
            <thead><tr><th>Driver</th><th>Route</th><th>Vehicle</th></tr></thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.route}</td>
                  <td>{d.vehicle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* Students */
const StudentsPanel = ({ students, setStudents }) => {
  const [search, setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ id:'', name:'', grade:'', route:'', parent:'', phone:'', fee:3500, status:'Active' });

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    setStudents(prev => [...prev, { ...form }]);
    setForm({ id:'', name:'', grade:'', route:'', parent:'', phone:'', fee:3500, status:'Active' });
    setShowForm(false);
  };

  const remove = (id) => setStudents(prev => prev.filter(s => s.id !== id));

  return (
    <div className="students-panel">
      <div className="panel-actions">
        <input className="search-input" placeholder="🔍 Search students…" value={search}
          onChange={e => setSearch(e.target.value)} />
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleAdd}>
          <h4>New Student</h4>
          <div className="form-grid">
            {[
              { name:'id', placeholder:'Student ID', label:'ID' },
              { name:'name', placeholder:'Full Name', label:'Name' },
              { name:'grade', placeholder:'e.g. Grade 5', label:'Grade' },
              { name:'route', placeholder:'e.g. Route A', label:'Route' },
              { name:'parent', placeholder:"Parent's Name", label:'Parent' },
              { name:'phone', placeholder:'07X-XXXXXXX', label:'Phone' },
            ].map(f => (
              <div className="form-group" key={f.name}>
                <label>{f.label}</label>
                <input type="text" placeholder={f.placeholder} value={form[f.name]}
                  onChange={e => setForm(prev => ({ ...prev, [f.name]: e.target.value }))} required />
              </div>
            ))}
          </div>
          <button type="submit" className="add-btn">Save Student</button>
        </form>
      )}

      <table className="admin-table full">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Grade</th><th>Route</th><th>Parent</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.grade}</td>
              <td>{s.route}</td>
              <td>{s.parent}</td>
              <td><span className={`status-pill ${s.status.toLowerCase()}`}>{s.status}</span></td>
              <td><button className="delete-btn" onClick={() => remove(s.id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* Drivers */
const DriversPanel = ({ drivers, setDrivers }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ id:'', name:'', phone:'', license:'', vehicle:'', route:'', experience:0, status:'Active' });

  const handleAdd = (e) => {
    e.preventDefault();
    setDrivers(prev => [...prev, { ...form }]);
    setForm({ id:'', name:'', phone:'', license:'', vehicle:'', route:'', experience:0, status:'Active' });
    setShowForm(false);
  };

  const remove = (id) => setDrivers(prev => prev.filter(d => d.id !== id));

  return (
    <div className="drivers-panel">
      <div className="panel-actions">
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Driver'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleAdd}>
          <h4>New Driver</h4>
          <div className="form-grid">
            {[
              { name:'id', label:'Driver ID' }, { name:'name', label:'Full Name' },
              { name:'phone', label:'Phone' },   { name:'license', label:'License No.' },
              { name:'vehicle', label:'Vehicle No.' }, { name:'route', label:'Assigned Route' },
              { name:'experience', label:'Experience (yrs)' },
            ].map(f => (
              <div className="form-group" key={f.name}>
                <label>{f.label}</label>
                <input type="text" value={form[f.name]}
                  onChange={e => setForm(prev => ({ ...prev, [f.name]: e.target.value }))} required />
              </div>
            ))}
          </div>
          <button type="submit" className="add-btn">Save Driver</button>
        </form>
      )}

      <table className="admin-table full">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Phone</th><th>License</th><th>Vehicle</th><th>Route</th><th>Exp.</th><th></th></tr>
        </thead>
        <tbody>
          {drivers.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.phone}</td>
              <td>{d.license}</td>
              <td>{d.vehicle}</td>
              <td>{d.route}</td>
              <td>{d.experience} yr{d.experience !== 1 ? 's' : ''}</td>
              <td><button className="delete-btn" onClick={() => remove(d.id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* Routes */
const RoutesPanel = ({ routes }) => (
  <div className="routes-panel">
    <div className="routes-grid">
      {routes.map(r => (
        <div className="route-card" key={r.id}>
          <div className="route-card-header">
            <h4>{r.name}</h4>
            <span className="students-count">{r.students} students</span>
          </div>
          <div className="route-meta">
            <span>🚐 {r.driver}</span>
            <span>📏 {r.distance}</span>
          </div>
          <div className="route-stops-list">
            {r.stops.map((stop, i) => (
              <div key={i} className="route-stop">
                <span className="route-stop-num">{i + 1}</span>
                <span>{stop}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* Payments */
const PaymentsPanel = ({ payments }) => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Paid', 'Pending', 'Overdue'];

  const filtered = filter === 'All' ? payments : payments.filter(p => p.status === filter);

  const totals = {
    collected: payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0),
    pending:   payments.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0),
  };

  return (
    <div className="payments-panel">
      <div className="payment-summary">
        <div className="summary-card green">
          <span className="summary-label">Collected</span>
          <span className="summary-value">LKR {totals.collected.toLocaleString()}</span>
        </div>
        <div className="summary-card red">
          <span className="summary-label">Outstanding</span>
          <span className="summary-value">LKR {totals.pending.toLocaleString()}</span>
        </div>
      </div>

      <div className="filter-row">
        {filters.map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <table className="admin-table full">
        <thead>
          <tr><th>ID</th><th>Student</th><th>Month</th><th>Amount</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.student}</td>
              <td>{p.month}</td>
              <td>LKR {p.amount.toLocaleString()}</td>
              <td><span className={`status-pill ${p.status.toLowerCase()}`}>{p.status}</span></td>
              <td>{p.date || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* Attendance report */
const AttendanceReport = ({ records }) => {
  const [dateFilter, setDateFilter] = useState('');

  const filtered = dateFilter
    ? records.filter(r => r.date === dateFilter)
    : records;

  const dates = [...new Set(records.map(r => r.date))].sort((a,b) => b.localeCompare(a));

  return (
    <div className="attendance-report">
      <div className="panel-actions">
        <select className="search-input" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
          <option value="">All Days</option>
          {dates.map(d => <option key={d} value={d}>{new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</option>)}
        </select>
      </div>

      <table className="admin-table full">
        <thead>
          <tr><th>Student</th><th>Date</th><th>Morning</th><th>Afternoon</th></tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={i}>
              <td>{r.student}</td>
              <td>{new Date(r.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
              <td>{r.morning   ? '✅' : '❌'}</td>
              <td>{r.afternoon ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Monthly Report (Admin)
───────────────────────────────────────────── */
const MONTHLY_DATA = [
  {
    month: 'March 2026',
    students: 30,
    avgAttendance: 88,
    totalTrips: 42,
    collected: 87500,
    pending: 17500,
    routes: [
      { name: 'Route A', trips: 14, students: 12, avgAtt: 91 },
      { name: 'Route B', trips: 14, students: 10, avgAtt: 86 },
      { name: 'Route C', trips: 14, students: 8,  avgAtt: 85 },
    ],
  },
  {
    month: 'February 2026',
    students: 30,
    avgAttendance: 92,
    totalTrips: 40,
    collected: 98000,
    pending: 7000,
    routes: [
      { name: 'Route A', trips: 14, students: 12, avgAtt: 94 },
      { name: 'Route B', trips: 13, students: 10, avgAtt: 91 },
      { name: 'Route C', trips: 13, students: 8,  avgAtt: 90 },
    ],
  },
  {
    month: 'January 2026',
    students: 28,
    avgAttendance: 90,
    totalTrips: 44,
    collected: 91000,
    pending: 7000,
    routes: [
      { name: 'Route A', trips: 15, students: 11, avgAtt: 92 },
      { name: 'Route B', trips: 15, students: 10, avgAtt: 89 },
      { name: 'Route C', trips: 14, students: 7,  avgAtt: 88 },
    ],
  },
];

const AdminMonthlyReport = () => {
  const [selected, setSelected] = React.useState(MONTHLY_DATA[0]);

  return (
    <div className="admin-monthly-report">
      <div className="month-selector">
        {MONTHLY_DATA.map(m => (
          <button
            key={m.month}
            className={`month-btn ${selected.month === m.month ? 'active' : ''}`}
            onClick={() => setSelected(m)}
          >
            {m.month}
          </button>
        ))}
      </div>

      <div className="amr-stats">
        <div className="amr-stat" style={{ borderTop: '4px solid #3498db' }}>
          <span className="amr-val">{selected.students}</span>
          <span className="amr-lbl">Total Students</span>
        </div>
        <div className="amr-stat" style={{ borderTop: '4px solid #2ecc71' }}>
          <span className="amr-val">{selected.avgAttendance}%</span>
          <span className="amr-lbl">Avg Attendance</span>
        </div>
        <div className="amr-stat" style={{ borderTop: '4px solid #9b59b6' }}>
          <span className="amr-val">{selected.totalTrips}</span>
          <span className="amr-lbl">Total Trips</span>
        </div>
        <div className="amr-stat" style={{ borderTop: '4px solid #27ae60' }}>
          <span className="amr-val">LKR {selected.collected.toLocaleString()}</span>
          <span className="amr-lbl">Fees Collected</span>
        </div>
        <div className="amr-stat" style={{ borderTop: '4px solid #e74c3c' }}>
          <span className="amr-val">LKR {selected.pending.toLocaleString()}</span>
          <span className="amr-lbl">Outstanding</span>
        </div>
      </div>

      <div className="amr-revenue-bar">
        <div className="bar-label">
          <span>Collection Rate</span>
          <strong>{Math.round((selected.collected / (selected.collected + selected.pending)) * 100)}%</strong>
        </div>
        <div className="bar-track">
          <div
            className="bar-fill green"
            style={{ width: `${Math.round((selected.collected / (selected.collected + selected.pending)) * 100)}%` }}
          />
        </div>
      </div>

      <h4>Per-Route Breakdown</h4>
      <table className="admin-table full">
        <thead>
          <tr>
            <th>Route</th>
            <th>Driver Trips</th>
            <th>Students</th>
            <th>Avg Attendance</th>
            <th>Attendance Bar</th>
          </tr>
        </thead>
        <tbody>
          {selected.routes.map(r => (
            <tr key={r.name}>
              <td><strong>{r.name}</strong></td>
              <td>{r.trips}</td>
              <td>{r.students}</td>
              <td>{r.avgAtt}%</td>
              <td>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: `${r.avgAtt}%` }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main AdminDashboard
───────────────────────────────────────────── */
const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents]   = useState(SEED_STUDENTS);
  const [drivers, setDrivers]     = useState(SEED_DRIVERS);

  const tabs = [
    { id: 'overview',    label: '📊 Overview'   },
    { id: 'students',    label: '👧 Students'   },
    { id: 'drivers',     label: '🚐 Drivers'    },
    { id: 'routes',      label: '🗺️ Routes'     },
    { id: 'payments',    label: '💰 Payments'   },
    { id: 'attendance',  label: '📋 Attendance' },
    { id: 'report',      label: '📅 Reports'    },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':   return <Overview students={students} drivers={drivers} payments={SEED_PAYMENTS} />;
      case 'students':   return <StudentsPanel students={students} setStudents={setStudents} />;
      case 'drivers':    return <DriversPanel drivers={drivers} setDrivers={setDrivers} />;
      case 'routes':     return <RoutesPanel routes={SEED_ROUTES} />;
      case 'payments':   return <PaymentsPanel payments={SEED_PAYMENTS} />;
      case 'attendance': return <AttendanceReport records={SEED_ATTENDANCE} />;
      case 'report':     return <AdminMonthlyReport />;
      default:           return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h2>🔑 Admin Dashboard</h2>
          <p>School Transport Management System</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="admin-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`admin-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        <h3>{tabs.find(t => t.id === activeTab)?.label}</h3>
        {renderTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;
