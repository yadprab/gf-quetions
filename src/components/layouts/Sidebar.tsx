import { NavLink } from 'react-router-dom';
import {    
FaHome,
FaUsers,
FaCog,
FaFile
} from 'react-icons/fa';

import './Layout.css';

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { label: 'Invoices', path: '/invoice', icon: <FaFile /> },
    { label: 'Customers', path: '/customers', icon: <FaUsers /> },
    { label: 'Settings', path: '/settings', icon: <FaCog /> },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-title">{!collapsed && 'NAVIGATION'}</div>
      <nav>
        {menuItems.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
