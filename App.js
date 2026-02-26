import React, { useState, useEffect } from 'react';
import './App.css';

// Import pages (we'll create these components)
import HomePage from './HomePage';
import RegistrationPage from './RegistrationPage';
import DriverDashboard from './DriverDashboard';
import ParentDashboard from './ParentDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in on app start
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
    // Save user to localStorage (in real app, this would be an API call)
    localStorage.setItem('schoolVanUser', JSON.stringify(userData));
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

  // Render appropriate page based on state
  const renderPage = () => {
    if (!isLoggedIn) {
      switch(currentPage) {
        case 'register':
          return <RegistrationPage onRegister={handleRegistration} />;
        default:
          return <HomePage onNavigate={navigateTo} />;
      }
    } else {
      switch(userType) {
        case 'driver':
          return <DriverDashboard onLogout={handleLogout} />;
        case 'parent':
          return <ParentDashboard onLogout={handleLogout} />;
        default:
          return <HomePage onNavigate={navigateTo} />;
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title" onClick={() => navigateTo('home')}>
            🚐 School Van Service
          </h1>
          {isLoggedIn && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
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
