import React, { useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useVoyages } from '../../context/VoyageContext';
import { useVessels } from '../../context/VesselContext';
import { Bell, AlertTriangle, User, HelpCircle } from 'lucide-react';

export default function Header() {
  const { user, login } = useAuth();
  const { alerts, voyages } = useVoyages();
  const { vessels } = useVessels();
  
  const [showAlertsList, setShowAlertsList] = useState(false);

  const handleRoleChange = (e) => {
    login(user.email, 'password', e.target.value);
  };

  const activeAlertsCount = alerts.filter(a => a.status === 'Open').length;

  return (
    <header className="header">
      {/* Dynamic Operational Status Widgets */}
      <div className="d-flex align-items-center gap-4">
        <div className="d-none d-md-flex align-items-center gap-2">
          <span className="text-secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Fleet Status:</span>
          <span className="badge badge-sea">42 Active</span>
          <span className="badge badge-port">3 In Port</span>
          <span className="badge badge-anchor">2 Anchored</span>
        </div>
      </div>

      {/* User settings, role picker, alerts center */}
      <div className="d-flex align-items-center gap-3">
        {/* Role Selector Switch */}
        <div className="d-flex align-items-center gap-2">
          <label className="text-secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }} htmlFor="role-select">Role:</label>
          <select 
            id="role-select"
            className="form-input py-1 px-2 border-cyan text-cyan"
            style={{ width: '150px', fontSize: '12px' }}
            value={user.role}
            onChange={handleRoleChange}
          >
            <option value={ROLES.OPERATOR}>Marine Operator</option>
            <option value={ROLES.MASTER}>Vessel Master</option>
            <option value={ROLES.TECH_MANAGER}>Technical Manager</option>
            <option value={ROLES.CHARTERER}>Charterer</option>
            <option value={ROLES.ADMIN}>System Admin</option>
          </select>
        </div>

        {/* Notifications and Alerts Dropdown */}
        <div className="position-relative">
          <button 
            className="btn btn-secondary p-2 position-relative"
            onClick={() => setShowAlertsList(!showAlertsList)}
          >
            <Bell size={16} className={activeAlertsCount > 0 ? "text-cyan" : ""} />
            {activeAlertsCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ padding: '3px 6px', fontSize: '9px' }}>
                {activeAlertsCount}
              </span>
            )}
          </button>

          {showAlertsList && (
            <div 
              className="glass-panel position-absolute end-0 mt-2" 
              style={{ width: '320px', zIndex: 200, maxHeight: '400px', overflowY: 'auto' }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-maritime">
                <span className="fw-bold" style={{ fontSize: '12px' }}>Operational Alerts</span>
                <span className="badge badge-alert">{activeAlertsCount} Active</span>
              </div>
              <div className="d-flex flex-column gap-2">
                {alerts.length === 0 ? (
                  <div className="text-center text-muted py-3" style={{ fontSize: '11px' }}>No active alerts</div>
                ) : (
                  alerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`alert-card-item ${alert.type === 'Severe Weather Ahead' ? 'warning' : 'danger'}`}
                      style={{ padding: '8px', margin: 0 }}
                    >
                      <div className="d-flex align-items-center gap-1 mb-1">
                        <AlertTriangle size={12} className={alert.type === 'Severe Weather Ahead' ? 'text-warning' : 'text-danger'} />
                        <span className="fw-bold" style={{ fontSize: '11px' }}>{alert.type}</span>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        <strong>{alert.vessel}</strong> - {alert.issue}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-1" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                        <span>Loss: ${alert.estLoss.toLocaleString()}</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile identifier */}
        <div className="d-none d-sm-flex align-items-center gap-2">
          <div className="text-end">
            <div className="fw-bold" style={{ fontSize: '12px' }}>{user.name}</div>
            <div className="text-muted" style={{ fontSize: '10px' }}>{user.role}</div>
          </div>
          <div className="btn-cyan p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
