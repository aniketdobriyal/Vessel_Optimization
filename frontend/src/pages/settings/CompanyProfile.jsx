import React, { useState } from 'react';
import { Settings, Users, Bell, Building } from 'lucide-react';

export default function CompanyProfile() {
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="text-cyan mb-1">SYSTEM SETTINGS</h2>
        <p className="text-secondary" style={{ fontSize: '12px' }}>Configure shipping company profiles, user operations permissions, and automated alert notification thresholds</p>
      </div>

      <div className="reports-tab-container">
        <button 
          className={`report-tab-btn ${activeSettingsTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSettingsTab('profile')}
        >
          Company Profile
        </button>
        <button 
          className={`report-tab-btn ${activeSettingsTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSettingsTab('users')}
        >
          Users & Roles
        </button>
        <button 
          className={`report-tab-btn ${activeSettingsTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveSettingsTab('notifications')}
        >
          Notification Settings
        </button>
      </div>

      {activeSettingsTab === 'profile' && (
        <div className="glass-panel" style={{ maxWidth: '600px' }}>
          <div className="panel-title">
            <Building size={14} className="text-cyan" />
            <span>Maritime Carrier Information</span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Company profile saved.'); }}>
            <div className="form-group">
              <label className="form-label" htmlFor="comp-name-input">Carrier Name</label>
              <input id="comp-name-input" type="text" className="form-input" defaultValue="Oceanic Blue Shipping Line" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="comp-hq-input">Headquarters Position</label>
              <input id="comp-hq-input" type="text" className="form-input" defaultValue="Harbourfront Towers, Singapore" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="comp-code-input">Standard IMO Company Code</label>
              <input id="comp-code-input" type="text" className="form-input" defaultValue="IMO 5892461" />
            </div>
            <button type="submit" className="btn btn-cyan px-4 mt-2">SAVE CHANGES</button>
          </form>
        </div>
      )}

      {activeSettingsTab === 'users' && (
        <div className="glass-panel">
          <div className="panel-title">
            <Users size={14} className="text-cyan" />
            <span>Authorized Operators Directory</span>
          </div>
          <div className="maritime-table-wrapper">
            <table className="maritime-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Corporate Email</th>
                  <th>Operations Role</th>
                  <th>Access Scope</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold">Capt. Alex Mercer</td>
                  <td>alex.mercer@oceanic-shipping.com</td>
                  <td>Master / Vessel Master</td>
                  <td>Active voyage logs, Noon entries</td>
                  <td><span className="badge badge-sea">Online</span></td>
                </tr>
                <tr>
                  <td className="fw-bold">Sarah Jenkins</td>
                  <td>sarah.j@oceanic-shipping.com</td>
                  <td>Marine Operator</td>
                  <td>All Vessels, optimization logs</td>
                  <td><span className="badge badge-sea">Online</span></td>
                </tr>
                <tr>
                  <td className="fw-bold">Marcus Thorne</td>
                  <td>marcus.t@oceanic-shipping.com</td>
                  <td>Technical Manager</td>
                  <td>Full performance diagnostics</td>
                  <td><span className="badge badge-anchor">Offline</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSettingsTab === 'notifications' && (
        <div className="glass-panel" style={{ maxWidth: '600px' }}>
          <div className="panel-title">
            <Bell size={14} className="text-cyan" />
            <span>Automated Alert Channels</span>
          </div>
          <div className="d-flex flex-column gap-3 py-2">
            <label className="d-flex align-items-center justify-content-between" style={{ cursor: 'pointer' }}>
              <span>Trigger instant email notification for Speed Claims</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="d-flex align-items-center justify-content-between" style={{ cursor: 'pointer' }}>
              <span>Telegram webhook integration for Storm Forecast warnings</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="d-flex align-items-center justify-content-between" style={{ cursor: 'pointer' }}>
              <span>Noon report reminder alert to Masters at 11:30 UTC daily</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
