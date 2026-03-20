import React, { useState, useEffect } from 'react';
import './App.css';

import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import DriverDashboard from './DriverDashboard';
import ParentDashboard from './ParentDashboard';
import AdminDashboard from './AdminDashboard';
import { clearSession, fetchMe, getSession, saveSession } from './api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const session = getSession();

      if (!session?.token) {
        setBooting(false);
        return;
      }

      try {
        const response = await fetchMe();
        const normalizedUser = {
          ...response.user,
          type: response.user.role,
          id: response.user.accountId,
          licenseNumber: response.user.driverProfile?.licenseNumber,
          vehicleNumber: response.user.driverProfile?.vehicleNumber,
          experience: response.user.driverProfile?.experience,
          childName: response.user.parentProfile?.childName,
          childGrade: response.user.parentProfile?.childGrade,
          pickupPoint: response.user.parentProfile?.pickupPoint,
          dropoffPoint: response.user.parentProfile?.dropoffPoint,
        };

        saveSession({ token: session.token, user: normalizedUser });
        setUser(normalizedUser);
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
      } catch (error) {
        clearSession();
      } finally {
        setBooting(false);
      }
    };

    restoreSession();
  }, []);

  const handleAuthSuccess = ({ token, user: userData }) => {
    const normalizedUser = {
      ...userData,
      type: userData.role,
      id: userData.accountId,
      licenseNumber: userData.driverProfile?.licenseNumber,
      vehicleNumber: userData.driverProfile?.vehicleNumber,
      experience: userData.driverProfile?.experience,
      childName: userData.parentProfile?.childName,
      childGrade: userData.parentProfile?.childGrade,
      pickupPoint: userData.parentProfile?.pickupPoint,
      dropoffPoint: userData.parentProfile?.dropoffPoint,
    };

    saveSession({ token, user: normalizedUser });
    setUser(normalizedUser);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (booting) {
      return <div className="homepage"><div className="hero-section"><div className="hero-content"><h2>Loading session...</h2></div></div></div>;
    }

    if (!isLoggedIn) {
      switch (currentPage) {
        case 'register':
          return <RegistrationPage onRegister={handleAuthSuccess} onNavigate={navigateTo} />;
        case 'login':
          return <LoginPage onLogin={handleAuthSuccess} onNavigate={navigateTo} />;
        default:
          return <HomePage onNavigate={navigateTo} />;
      }
    } else {
      switch (user?.type) {
        case 'driver':
          return <DriverDashboard user={user} onLogout={handleLogout} />;
        case 'parent':
          return <ParentDashboard user={user} onLogout={handleLogout} />;
        case 'admin':
          return <AdminDashboard user={user} onLogout={handleLogout} />;
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
