import React, { useState } from 'react';
import { Compass, Ship, ChevronLeft } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export default function Register({ onBack }) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.OPERATOR);
  const [license, setLicense] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reqId, setReqId] = useState('');

  const handleRegisterRequest = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !name.trim() || !password.trim() || !role) {
      setError('Please fill out Name, Corporate Email, Password, and Role.');
      return;
    }

    setError('');

    try {
      await register(name, email, password, role, license);
      setReqId(`VYG-${Math.floor(Math.random() * 9000 + 1000)}`);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Access denied.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay" />

      <div className="login-card">
        <div className="brand-section">
          <div className="brand-icon">
            <Compass className="text-cyan pulse-pin" size={30} />
          </div>

          <h1 className="login-title">
            Request Access
          </h1>

          <div className="login-badge">
            Maritime Operations Platform
          </div>

          <p className="login-subtitle">
            SaaS Fleet Command Center
          </p>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-teal fw-bold mb-2" style={{ fontSize: '14px' }}>ACCESS REQUEST GRANTED</div>
            <p className="text-secondary mb-4" style={{ fontSize: '11.5px' }}>
              Your account has been registered successfully with ID reference strong <strong>{reqId}</strong>. 
              You can now return to the gateway login page and log in with your credentials.
            </p>
            {onBack && (
              <button className="login-btn w-100" onClick={onBack}>
                <ChevronLeft size={16} /> RETURN TO LOGIN
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleRegisterRequest}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Corporate Email</label>
              <input 
                type="email" 
                placeholder="e.g. operator@oceanic-shipping.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value={ROLES.OPERATOR}>Fleet Operator</option>
                <option value={ROLES.MASTER}>Vessel Master</option>
                <option value={ROLES.TECH_MANAGER}>Technical Manager</option>
                <option value={ROLES.CHARTERER}>Commercial Charterer</option>
                <option value={ROLES.ADMIN}>System Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label>IMO Ship License / Office Code</label>
              <input 
                type="text" 
                placeholder="e.g. IMO-COMP-5892"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn w-100">
              <Ship size={18} /> SUBMIT  APPLICATION
            </button>

            {onBack && (
              <button type="button" className="login-btn btn-secondary w-100 mt-4" onClick={onBack}>
                <ChevronLeft size={16} /> BACK TO GATEWAY
              </button>
            )}
          </form>
        )}

        <div className="security-note">
          Restricted access. All transmissions are encrypted and logged under IMO operational guidelines.
        </div>
      </div>
    </div>
  );
}
