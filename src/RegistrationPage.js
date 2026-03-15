import React, { useState } from 'react';
import './RegistrationPage.css';

const RegistrationPage = ({ onRegister, onNavigate }) => {
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    vehicleNumber: '',
    experience: '',
    childName: '',
    childGrade: '',
    pickupPoint: '',
    dropoffPoint: '',
    adminCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === 'admin' && formData.adminCode !== 'ADMIN2026') {
      alert('Invalid admin access code. Please try again.');
      return;
    }
    onRegister({
      type: userType,
      ...formData
    });
  };

  const renderDriverForm = () => (
    <form onSubmit={handleSubmit} className="registration-form">
      <h3>Driver Registration</h3>
      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label>Driver ID *</label>
        <input
          type="text"
          name="id"
          required
          value={formData.id}
          onChange={handleInputChange}
          placeholder="Enter driver ID"
        />
      </div>

      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter email address"
        />
      </div>

      <div className="form-group">
        <label>License Number *</label>
        <input
          type="text"
          name="licenseNumber"
          required
          value={formData.licenseNumber}
          onChange={handleInputChange}
          placeholder="Enter driving license number"
        />
      </div>

      <div className="form-group">
        <label>Vehicle Number *</label>
        <input
          type="text"
          name="vehicleNumber"
          required
          value={formData.vehicleNumber}
          onChange={handleInputChange}
          placeholder="Enter vehicle registration number"
        />
      </div>

      <div className="form-group">
        <label>Years of Experience</label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          placeholder="Years of driving experience"
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your address"
          rows="3"
        />
      </div>

      <button type="submit" className="submit-btn">Register as Driver</button>
    </form>
  );

  const renderParentForm = () => (
    <form onSubmit={handleSubmit} className="registration-form">
      <h3>Parent Registration</h3>
      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label>Parent ID *</label>
        <input
          type="text"
          name="id"
          required
          value={formData.id}
          onChange={handleInputChange}
          placeholder="Enter parent ID"
        />
      </div>

      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter email address"
        />
      </div>

      <div className="form-group">
        <label>Child's Name *</label>
        <input
          type="text"
          name="childName"
          required
          value={formData.childName}
          onChange={handleInputChange}
          placeholder="Enter child's full name"
        />
      </div>

      <div className="form-group">
        <label>Child's Grade *</label>
        <input
          type="text"
          name="childGrade"
          required
          value={formData.childGrade}
          onChange={handleInputChange}
          placeholder="Enter child's grade/class"
        />
      </div>

      <div className="form-group">
        <label>Pickup Point *</label>
        <input
          type="text"
          name="pickupPoint"
          required
          value={formData.pickupPoint}
          onChange={handleInputChange}
          placeholder="Enter pickup location"
        />
      </div>

      <div className="form-group">
        <label>Dropoff Point *</label>
        <input
          type="text"
          name="dropoffPoint"
          required
          value={formData.dropoffPoint}
          onChange={handleInputChange}
          placeholder="Enter school/dropoff location"
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your address"
          rows="3"
        />
      </div>

      <button type="submit" className="submit-btn">Register as Parent</button>
    </form>
  );

  const renderAdminForm = () => (
    <form onSubmit={handleSubmit} className="registration-form">
      <h3>Admin Registration</h3>
      <p className="admin-note">⚠️ Admin access is restricted. Enter the access code provided by your organisation.</p>

      <div className="form-group">
        <label>Full Name *</label>
        <input type="text" name="name" required value={formData.name}
          onChange={handleInputChange} placeholder="Enter your full name" />
      </div>

      <div className="form-group">
        <label>Admin ID *</label>
        <input type="text" name="id" required value={formData.id}
          onChange={handleInputChange} placeholder="Enter admin ID" />
      </div>

      <div className="form-group">
        <label>Phone Number *</label>
        <input type="tel" name="phone" required value={formData.phone}
          onChange={handleInputChange} placeholder="Enter phone number" />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" value={formData.email}
          onChange={handleInputChange} placeholder="Enter email address" />
      </div>

      <div className="form-group">
        <label>Admin Access Code *</label>
        <input type="password" name="adminCode" required value={formData.adminCode}
          onChange={handleInputChange} placeholder="Enter secret access code" />
      </div>

      <button type="submit" className="submit-btn">Access Admin Dashboard</button>
    </form>
  );

  return (
    <div className="registration-page">
      {!userType ? (
        <div className="user-type-selection">
          <h2>Choose Account Type</h2>
          <p>Select how you want to use School Van Service</p>
          
          <div className="selection-cards">
            <div 
              className="type-card driver-card"
              onClick={() => setUserType('driver')}
            >
              <div className="card-icon">🚐</div>
              <h3>I'm a Driver</h3>
              <p>Manage your routes, track attendance, and communicate with parents</p>
              <ul className="feature-list">
                <li>✓ Track daily attendance</li>
                <li>✓ Manage your route</li>
                <li>✓ View children list</li>
                <li>✓ Payment tracking</li>
              </ul>
            </div>

            <div 
              className="type-card parent-card"
              onClick={() => setUserType('parent')}
            >
              <div className="card-icon">👪</div>
              <h3>I'm a Parent</h3>
              <p>Track your child's journey and receive real-time updates</p>
              <ul className="feature-list">
                <li>✓ Track child's location</li>
                <li>✓ Receive arrival alerts</li>
                <li>✓ View route information</li>
                <li>✓ Make payments online</li>
              </ul>
            </div>

            <div 
              className="type-card admin-card"
              onClick={() => setUserType('admin')}
            >
              <div className="card-icon">🔑</div>
              <h3>Admin</h3>
              <p>Manage students, drivers, routes, and payments for the transport service</p>
              <ul className="feature-list">
                <li>✓ Manage students &amp; drivers</li>
                <li>✓ View all routes</li>
                <li>✓ Track all payments</li>
                <li>✓ Generate reports</li>
              </ul>
            </div>
          </div>
          
          <button 
            className="back-btn"
            onClick={() => onNavigate('home')}
          >
            ← Back to Home
          </button>
        </div>
      ) : (
        <div className="registration-form-container">
          <button 
            className="back-btn"
            onClick={() => setUserType(null)}
          >
            ← Change Account Type
          </button>
          
          {userType === 'driver' ? renderDriverForm() : userType === 'admin' ? renderAdminForm() : renderParentForm()}
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
