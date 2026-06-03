import React, { useState } from 'react';
import { Compass, Ship, ChevronLeft } from 'lucide-react';

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleResetRequest = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please fill out your Corporate Email.');
      return;
    }
    setSubmitted(true);
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
            Reset Password
          </h1>

          <div className="login-badge">
            Maritime Operations Platform
          </div>

          <p className="login-subtitle">
            SaaS Fleet Command Center
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-teal fw-bold mb-2" style={{ fontSize: '14px' }}>RECOVERY DISPATCHED</div>
            <p className="text-secondary mb-4" style={{ fontSize: '11.5px' }}>
              We have dispatched a secure authentication key reset token to <strong>{email}</strong>. 
              Please verify your corporate inbox or check with your maritime IT ops administrator.
            </p>
            {onBack && (
              <button className="login-btn w-100" onClick={onBack}>
                <ChevronLeft size={16} /> RETURN TO LOGIN
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleResetRequest}>
            <div className="form-group">
              <label>Corporate Email</label>
              <input 
                type="email" 
                placeholder="operator@oceanic-shipping.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>IMO Officer ID (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. MO-4492-OFF"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn w-100">
              <Ship size={18} /> DISPATCH RESET KEY
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
