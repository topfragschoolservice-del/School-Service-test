import React from 'react';
import './HomePage.css';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h2>Safe & Reliable School Transport</h2>
          <p>Track your child's journey in real-time with our advanced school van service</p>
          <button 
            className="register-btn pulse"
            onClick={() => onNavigate('register')}
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="features-section">
        <h3>Why Choose Our Service?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h4>Real-time Tracking</h4>
            <p>Track your child's van location in real-time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h4>Driver & Parent Portal</h4>
            <p>Separate dashboards for drivers and parents</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>Instant Notifications</h4>
            <p>Get alerts when the van arrives or departs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h4>Easy Payments</h4>
            <p>Secure online payment for transportation fees</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h3>Ready to get started?</h3>
        <p>Join thousands of satisfied parents and drivers</p>
        <button 
          className="register-btn large"
          onClick={() => onNavigate('register')}
        >
          Create Your Account
        </button>
      </div>
    </div>
  );
};

export default HomePage;
