import React, { useState, useEffect } from 'react';
import './App.css';

import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import DriverDashboard from './DriverDashboard';
import ParentDashboard from './ParentDashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Restore session on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('schoolVanUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserType(user.type);
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleRegistration = (userData) => {
    localStorage.setItem('schoolVanUser', JSON.stringify(userData));
    setUserType(userData.type);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogin = (userData) => {
    setUserType(userData.type);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('schoolVanUser');
    setUserType(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (!isLoggedIn) {
      switch (currentPage) {
        case 'register':
          return <RegistrationPage onRegister={handleRegistration} onNavigate={navigateTo} />;
        case 'login':
          return <LoginPage onLogin={handleLogin} onNavigate={navigateTo} />;
        default:
          return <HomePage onNavigate={navigateTo} />;
      }
    } else {
      switch (userType) {
        case 'driver':
          return <DriverDashboard onLogout={handleLogout} />;
        case 'parent':
          return <ParentDashboard onLogout={handleLogout} />;
        case 'admin':
          return <AdminDashboard onLogout={handleLogout} />;
        default:
          return <HomePage onNavigate={navigateTo} />;
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title" onClick={() => !isLoggedIn && navigateTo('home')}>
            🚐 School Van Service
          </h1>
          {!isLoggedIn ? (
            <div className="header-nav">
              <button className="nav-btn" onClick={() => navigateTo('login')}>Login</button>
              <button className="nav-btn primary" onClick={() => navigateTo('register')}>Register</button>
            </div>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </header>
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
