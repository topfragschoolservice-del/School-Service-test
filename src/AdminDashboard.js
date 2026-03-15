import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import {
  deleteStudent,
  deleteUser,
  fetchAdminReport,
  fetchAttendance,
  fetchPayments,
  fetchRoutes,
  fetchStudents,
  fetchUsers,
  registerUser,
} from './api';
import { formatPaymentMonth, monthOptions } from './dateUtils';

const titleCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);

const Overview = ({ students, drivers, payments, report }) => {
  const collected = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments.filter((payment) => payment.status !== 'paid').reduce((sum, payment) => sum + payment.amount, 0);

  const stats = [
    { label: 'Total Students', value: students.length, icon: '👧', color: '#3498db' },
    { label: 'Active Drivers', value: drivers.length, icon: '🚐', color: '#2ecc71' },
    { label: 'Fees Collected', value: `LKR ${collected.toLocaleString()}`, icon: '💰', color: '#f39c12' },
    { label: 'Attendance Rate', value: `${report?.attendanceRate || 0}%`, icon: '📊', color: '#9b59b6' },
  ];

  return (
    <div className="overview-panel">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label} style={{ borderTop: `5px solid ${stat.color}` }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="overview-sections">
        <div className="overview-section">
          <h4>Recent Payments</h4>
          <table className="admin-table">
            <thead><tr><th>Student</th><th>Month</th><th>Status</th></tr></thead>
            <tbody>
              {payments.slice(0, 5).map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.student?.fullName || '—'}</td>
                  <td>{formatPaymentMonth(payment.month, payment.year)}</td>
                  <td><span className={`status-pill ${payment.status}`}>{titleCase(payment.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overview-section">
          <h4>Driver Status</h4>
          <table className="admin-table">
            <thead><tr><th>Driver</th><th>Vehicle</th><th>Experience</th></tr></thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver._id}>
                  <td>{driver.name}</td>
                  <td>{driver.driverProfile?.vehicleNumber || '—'}</td>
                  <td>{driver.driverProfile?.experience || 0} yrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudentsPanel = ({ students, routes, onCreate, onDelete, busy }) => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    id: '',
    phone: '',
    email: '',
    password: 'parent123',
    childName: '',
    childGrade: '',
    pickupPoint: '',
    dropoffPoint: '',
    routeId: '',
  });

  const filtered = students.filter((student) =>
    student.fullName.toLowerCase().includes(search.toLowerCase()) ||
    student.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const submit = async (event) => {
    event.preventDefault();
    await onCreate(form);
    setForm({
      name: '',
      id: '',
      phone: '',
      email: '',
      password: 'parent123',
      childName: '',
      childGrade: '',
      pickupPoint: '',
      dropoffPoint: '',
      routeId: '',
    });
    setShowForm(false);
  };

  return (
    <div className="students-panel">
      <div className="panel-actions">
        <input className="search-input" placeholder="🔍 Search students…" value={search} onChange={(event) => setSearch(event.target.value)} />
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Parent & Student'}</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={submit}>
          <h4>New Parent & Student</h4>
          <div className="form-grid">
            <div className="form-group"><label>Parent Name</label><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></div>
            <div className="form-group"><label>Parent ID</label><input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} required /></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
            <div className="form-group"><label>Child Name</label><input value={form.childName} onChange={(event) => setForm({ ...form, childName: event.target.value })} required /></div>
            <div className="form-group"><label>Grade</label><input value={form.childGrade} onChange={(event) => setForm({ ...form, childGrade: event.target.value })} required /></div>
            <div className="form-group"><label>Pickup Point</label><input value={form.pickupPoint} onChange={(event) => setForm({ ...form, pickupPoint: event.target.value })} required /></div>
            <div className="form-group"><label>Drop-off Point</label><input value={form.dropoffPoint} onChange={(event) => setForm({ ...form, dropoffPoint: event.target.value })} required /></div>
            <div className="form-group"><label>Route</label><select value={form.routeId} onChange={(event) => setForm({ ...form, routeId: event.target.value })}><option value="">Select route</option>{routes.map((route) => <option key={route._id} value={route._id}>{route.name}</option>)}</select></div>
          </div>
          <button type="submit" className="add-btn" disabled={busy}>Save Parent & Student</button>
        </form>
      )}

      <table className="admin-table full">
        <thead><tr><th>ID</th><th>Name</th><th>Grade</th><th>Route</th><th>Parent</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {filtered.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.fullName}</td>
              <td>{student.grade}</td>
              <td>{student.route?.name || '—'}</td>
              <td>{student.parent?.name || '—'}</td>
              <td><span className={`status-pill ${student.status}`}>{titleCase(student.status)}</span></td>
              <td><button className="delete-btn" onClick={() => onDelete(student._id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DriversPanel = ({ drivers, onCreate, onDelete, busy }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    id: '',
    phone: '',
    email: '',
    password: 'driver123',
    licenseNumber: '',
    vehicleNumber: '',
    experience: '',
  });

  const submit = async (event) => {
    event.preventDefault();
    await onCreate(form);
    setForm({
      name: '',
      id: '',
      phone: '',
      email: '',
      password: 'driver123',
      licenseNumber: '',
      vehicleNumber: '',
      experience: '',
    });
    setShowForm(false);
  };

  return (
    <div className="drivers-panel">
      <div className="panel-actions">
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Driver'}</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={submit}>
          <h4>New Driver</h4>
          <div className="form-grid">
            <div className="form-group"><label>Full Name</label><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></div>
            <div className="form-group"><label>Driver ID</label><input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} required /></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /></div>
            <div className="form-group"><label>Email</label><input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
            <div className="form-group"><label>License No.</label><input value={form.licenseNumber} onChange={(event) => setForm({ ...form, licenseNumber: event.target.value })} required /></div>
            <div className="form-group"><label>Vehicle No.</label><input value={form.vehicleNumber} onChange={(event) => setForm({ ...form, vehicleNumber: event.target.value })} required /></div>
            <div className="form-group"><label>Experience</label><input value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} /></div>
          </div>
          <button type="submit" className="add-btn" disabled={busy}>Save Driver</button>
        </form>
      )}

      <table className="admin-table full">
        <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>License</th><th>Vehicle</th><th>Exp.</th><th></th></tr></thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver._id}>
              <td>{driver.accountId}</td>
              <td>{driver.name}</td>
              <td>{driver.phone}</td>
              <td>{driver.driverProfile?.licenseNumber || '—'}</td>
              <td>{driver.driverProfile?.vehicleNumber || '—'}</td>
              <td>{driver.driverProfile?.experience || 0} yrs</td>
              <td><button className="delete-btn" onClick={() => onDelete(driver._id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RoutesPanel = ({ routes, students }) => (
  <div className="routes-panel">
    <div className="routes-grid">
      {routes.map((route) => {
        const studentCount = students.filter((student) => student.route?._id === route._id).length;
        return (
          <div className="route-card" key={route._id}>
            <div className="route-card-header">
              <h4>{route.name}</h4>
              <span className="students-count">{studentCount} students</span>
            </div>
            <div className="route-meta">
              <span>🚐 {route.driver?.name || 'Unassigned'}</span>
              <span>🕒 {route.morningPickupTime || '—'}</span>
            </div>
            <div className="route-stops-list">
              {route.stops.map((stop, index) => (
                <div key={stop} className="route-stop"><span className="route-stop-num">{index + 1}</span><span>{stop}</span></div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const PaymentsPanel = ({ payments }) => {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? payments : payments.filter((payment) => payment.status === filter);
  const totals = {
    collected: payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0),
    pending: payments.filter((payment) => payment.status !== 'paid').reduce((sum, payment) => sum + payment.amount, 0),
  };

  return (
    <div className="payments-panel">
      <div className="payment-summary">
        <div className="summary-card green"><span className="summary-label">Collected</span><span className="summary-value">LKR {totals.collected.toLocaleString()}</span></div>
        <div className="summary-card red"><span className="summary-label">Outstanding</span><span className="summary-value">LKR {totals.pending.toLocaleString()}</span></div>
      </div>
      <div className="filter-row">
        {['all', 'paid', 'pending', 'overdue'].map((value) => (
          <button key={value} className={`filter-btn ${filter === value ? 'active' : ''}`} onClick={() => setFilter(value)}>{titleCase(value)}</button>
        ))}
      </div>
      <table className="admin-table full">
        <thead><tr><th>Student</th><th>Month</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {filtered.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.student?.fullName || '—'}</td>
              <td>{formatPaymentMonth(payment.month, payment.year)}</td>
              <td>LKR {payment.amount.toLocaleString()}</td>
              <td><span className={`status-pill ${payment.status}`}>{titleCase(payment.status)}</span></td>
              <td>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AttendanceReport = ({ attendance }) => {
  const [dateFilter, setDateFilter] = useState('');
  const dates = [...new Set(attendance.map((record) => record.date))].sort((left, right) => right.localeCompare(left));
  const filtered = dateFilter ? attendance.filter((record) => record.date === dateFilter) : attendance;

  return (
    <div className="attendance-report">
      <div className="panel-actions">
        <select className="search-input" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
          <option value="">All Days</option>
          {dates.map((date) => <option key={date} value={date}>{date}</option>)}
        </select>
      </div>

      <table className="admin-table full">
        <thead><tr><th>Student</th><th>Date</th><th>Morning</th><th>Afternoon</th><th>Pickup</th><th>Drop-off</th></tr></thead>
        <tbody>
          {filtered.map((record) => (
            <tr key={record._id}>
              <td>{record.student?.fullName || '—'}</td>
              <td>{record.date}</td>
              <td>{record.morningAttendance === 'attending' ? '✅' : '❌'}</td>
              <td>{record.afternoonTransport === 'returning' ? '✅' : '❌'}</td>
              <td>{record.pickupStatus}</td>
              <td>{record.dropoffStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminMonthlyReport = ({ report, selectedMonth, onChangeMonth, routes, students, attendance }) => (
  <div className="admin-monthly-report">
    <div className="month-selector">
      {monthOptions.map((option) => (
        <button key={option.label} className={`month-btn ${selectedMonth.label === option.label ? 'active' : ''}`} onClick={() => onChangeMonth(option)}>{option.label}</button>
      ))}
    </div>

    <div className="amr-stats">
      <div className="amr-stat" style={{ borderTop: '4px solid #3498db' }}><span className="amr-val">{report?.totalStudents || students.length}</span><span className="amr-lbl">Total Students</span></div>
      <div className="amr-stat" style={{ borderTop: '4px solid #2ecc71' }}><span className="amr-val">{report?.attendanceRate || 0}%</span><span className="amr-lbl">Avg Attendance</span></div>
      <div className="amr-stat" style={{ borderTop: '4px solid #9b59b6' }}><span className="amr-val">{attendance.length}</span><span className="amr-lbl">Attendance Records</span></div>
      <div className="amr-stat" style={{ borderTop: '4px solid #27ae60' }}><span className="amr-val">LKR {(report?.collected || 0).toLocaleString()}</span><span className="amr-lbl">Fees Collected</span></div>
      <div className="amr-stat" style={{ borderTop: '4px solid #e74c3c' }}><span className="amr-val">LKR {(report?.pending || 0).toLocaleString()}</span><span className="amr-lbl">Outstanding</span></div>
    </div>

    <div className="amr-revenue-bar">
      <div className="bar-label"><span>Collection Rate</span><strong>{report?.collected || report?.pending ? Math.round(((report?.collected || 0) / ((report?.collected || 0) + (report?.pending || 0))) * 100) : 0}%</strong></div>
      <div className="bar-track"><div className="bar-fill green" style={{ width: `${report?.collected || report?.pending ? Math.round(((report?.collected || 0) / ((report?.collected || 0) + (report?.pending || 0))) * 100) : 0}%` }} /></div>
    </div>

    <h4>Per-Route Breakdown</h4>
    <table className="admin-table full">
      <thead><tr><th>Route</th><th>Driver</th><th>Students</th><th>Stops</th></tr></thead>
      <tbody>
        {routes.map((route) => (
          <tr key={route._id}>
            <td>{route.name}</td>
            <td>{route.driver?.name || 'Unassigned'}</td>
            <td>{students.filter((student) => student.route?._id === route._id).length}</td>
            <td>{route.stops.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[2]);
  const [students, setStudents] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadData = async (month = selectedMonth) => {
    setError('');
    try {
      const [studentList, driverList, routeList, paymentList, attendanceList, reportData] = await Promise.all([
        fetchStudents(),
        fetchUsers('driver'),
        fetchRoutes(),
        fetchPayments(),
        fetchAttendance(),
        fetchAdminReport(month.month, month.year),
      ]);

      setStudents(studentList);
      setDrivers(driverList);
      setRoutes(routeList);
      setPayments(paymentList);
      setAttendance(attendanceList);
      setReport(reportData);
    } catch (apiError) {
      setError(apiError.message || 'Failed to load admin dashboard.');
    }
  };

  useEffect(() => {
    loadData(selectedMonth);
  }, [selectedMonth.label]);

  const createStudent = async (form) => {
    setBusy(true);
    try {
      await registerUser({ role: 'parent', ...form });
      await loadData(selectedMonth);
    } catch (apiError) {
      setError(apiError.message || 'Failed to create parent and student.');
    } finally {
      setBusy(false);
    }
  };

  const createDriver = async (form) => {
    setBusy(true);
    try {
      await registerUser({ role: 'driver', ...form });
      await loadData(selectedMonth);
    } catch (apiError) {
      setError(apiError.message || 'Failed to create driver.');
    } finally {
      setBusy(false);
    }
  };

  const removeStudentRecord = async (studentId) => {
    setBusy(true);
    try {
      await deleteStudent(studentId);
      await loadData(selectedMonth);
    } catch (apiError) {
      setError(apiError.message || 'Failed to delete student.');
    } finally {
      setBusy(false);
    }
  };

  const removeDriverRecord = async (userId) => {
    setBusy(true);
    try {
      await deleteUser(userId);
      await loadData(selectedMonth);
    } catch (apiError) {
      setError(apiError.message || 'Failed to delete driver.');
    } finally {
      setBusy(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'students', label: '👧 Students' },
    { id: 'drivers', label: '🚐 Drivers' },
    { id: 'routes', label: '🗺️ Routes' },
    { id: 'payments', label: '💰 Payments' },
    { id: 'attendance', label: '📋 Attendance' },
    { id: 'report', label: '📅 Reports' },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview students={students} drivers={drivers} payments={payments} report={report} />;
      case 'students':
        return <StudentsPanel students={students} routes={routes} onCreate={createStudent} onDelete={removeStudentRecord} busy={busy} />;
      case 'drivers':
        return <DriversPanel drivers={drivers} onCreate={createDriver} onDelete={removeDriverRecord} busy={busy} />;
      case 'routes':
        return <RoutesPanel routes={routes} students={students} />;
      case 'payments':
        return <PaymentsPanel payments={payments} />;
      case 'attendance':
        return <AttendanceReport attendance={attendance} />;
      case 'report':
        return <AdminMonthlyReport report={report} selectedMonth={selectedMonth} onChangeMonth={setSelectedMonth} routes={routes} students={students} attendance={attendance} />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h2>🔑 Admin Dashboard</h2>
          <p>School Transport Management System</p>
        </div>
      </div>

      {error && <div className="payment-alert"><p>{error}</p></div>}

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        <h3>{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
        {renderTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;
