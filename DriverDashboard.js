import React from 'react';
import './Dashboard.css';

const DriverDashboard = ({ onLogout }) => {
  const dashboardButtons = [
    { id: 1, title: 'Today Attendance', icon: '📋', color: '#3498db', path: '/attendance' },
    { id: 2, title: 'Route', icon: '🗺️', color: '#e74c3c', path: '/route' },
    { id: 3, title: 'Children List', icon: '👥', color: '#2ecc71', path: '/children' },
    { id: 4, title: 'Payment', icon: '💰', color: '#f39c12', path: '/payment' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Driver Dashboard</h2>
        <p>Welcome back, Driver!</p>
      </div>

      <div className="dashboard-grid">
        {dashboardButtons.map(button => (
          <div 
            key={button.id} 
            className="dashboard-card"
            style={{ borderTop: `5px solid ${button.color}` }}
          >
            <div className="card-icon">{button.icon}</div>
            <h3>{button.title}</h3>
            <p>Click to manage {button.title.toLowerCase()}</p>
            <button 
              className="card-btn"
              style={{ background: button.color }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="quick-stats">
        <h3>Today's Overview</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Present Today</span>
            <span className="stat-value">18</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Absent</span>
            <span className="stat-value">2</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">20</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending Payments</span>
            <span className="stat-value">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
