import React, { useState } from 'react';
import { 
  Ship, BarChart3, Compass, FileText, CloudSun, Route, 
  Settings, ChevronDown, ChevronRight, Menu, AlertCircle, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ currentTab, setCurrentTab, isCollapsed, setIsCollapsed }) {
  const { logout } = useAuth();
  const [openMenus, setOpenMenus] = useState({
    fleet: true,
    voyages: true,
    reports: true,
    performance: true
  });

  const toggleMenu = (menuKey) => {
    setOpenMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const MenuItem = ({ id, label, icon: Icon, subItems = null, menuKey = null }) => {
    const isMenuOpen = openMenus[menuKey];
    
    if (subItems && menuKey) {
      return (
        <li className="sidebar-menu-item">
          <button 
            className={`sidebar-link w-100 text-start d-flex justify-content-between align-items-center`} 
            onClick={() => toggleMenu(menuKey)}
          >
            <span className="d-flex align-items-center gap-2">
              <Icon size={16} />
              <span className="sidebar-link-text">{label}</span>
            </span>
            {!isCollapsed && (isMenuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
          </button>
          {!isCollapsed && isMenuOpen && (
            <ul className="list-unstyled ps-4 mt-1 d-flex flex-column gap-1">
              {subItems.map(sub => (
                <li key={sub.id}>
                  <button 
                    onClick={() => setCurrentTab(sub.id)}
                    className={`sidebar-link w-100 text-start py-1 ${currentTab === sub.id ? 'active' : ''}`}
                    style={{ fontSize: '11px' }}
                  >
                    {sub.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li className="sidebar-menu-item">
        <button 
          onClick={() => setCurrentTab(id)}
          className={`sidebar-link w-100 text-start ${currentTab === id ? 'active' : ''}`}
        >
          <Icon size={16} />
          <span className="sidebar-link-text">{label}</span>
        </button>
      </li>
    );
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <Compass className="text-cyan pulse-pin" size={20} />
          {!isCollapsed && <span className="fw-bold tracking-tight">⚓ Vessel Opt</span>}
        </div>
        <button className="text-cyan p-1" onClick={() => setIsCollapsed(!isCollapsed)}>
          <Menu size={16} />
        </button>
      </div>

      <ul className="sidebar-menu">
        <MenuItem id="dashboard" label="Dashboard" icon={BarChart3} />
        
        <MenuItem 
          label="Fleet" 
          icon={Ship} 
          menuKey="fleet"
          subItems={[
            { id: 'vessels-list', label: 'All Vessels' },
            { id: 'vessels-add', label: 'Add Vessel' }
          ]} 
        />
        
        <MenuItem 
          label="Voyages" 
          icon={Compass} 
          menuKey="voyages"
          subItems={[
            { id: 'voyages-list', label: 'Active Voyages' },
            { id: 'voyages-history', label: 'Voyage History' }
          ]} 
        />
        
        <MenuItem 
          label="Reports" 
          icon={FileText} 
          menuKey="reports"
          subItems={[
            { id: 'reports-upload', label: 'Noon & COSP/EOSP Uploads' }
          ]} 
        />
        
        <MenuItem 
          label="Performance" 
          icon={BarChart3} 
          menuKey="performance"
          subItems={[
            { id: 'perf-speed', label: 'Speed Analysis' },
            { id: 'perf-fuel', label: 'Fuel Analysis' },
            { id: 'perf-claims', label: 'Claims' }
          ]} 
        />

        <MenuItem id="weather" label="Weather" icon={CloudSun} />
        <MenuItem id="optimization" label="Route Optimization" icon={Route} />
        <MenuItem id="analytics" label="Analytics Reports" icon={FileText} />
        <MenuItem id="settings" label="Settings" icon={Settings} />

        {/* Log Out added directly at the end of the main menu list */}
        <li className="sidebar-menu-item">
          <button 
            onClick={logout} 
            className="sidebar-link w-100 text-start text-danger d-flex align-items-center gap-2"
          >
            <LogOut size={16} />
            <span className="sidebar-link-text">Log Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
