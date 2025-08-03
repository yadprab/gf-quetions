import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PiHouseSimple } from "react-icons/pi";
import { PiFileText } from "react-icons/pi";
import { PiUsers } from "react-icons/pi";
import { PiUser } from "react-icons/pi";
import { PiGear } from "react-icons/pi";

const SideNavbar = ({ isCollapsed = false }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <PiHouseSimple /> },
    { path: '/invoices', label: 'Invoices', icon: <PiFileText /> },
    { path: '/customers', label: 'Customers', icon: <PiUsers /> },
    { path: '/customer-details', label: 'Customer Details', icon: <PiUser /> },
    { path: '/settings', label: 'Settings', icon: <PiGear /> }
  ];
  
  return (
    <div className={`fixed top-0 left-0 bottom-0 border-r border-gray-200  !text-black z-40 transition-all duration-200 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <h1 className={`font-bold text-lg ${isCollapsed ? 'hidden' : ''}`}>
          Navigation
        </h1>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-4 !text-black">
          {navItems.map(({ path, label, icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center px-3 py-2 rounded-md font-medium text-sm ${
                  isActive(path)
                    ? 'bg-blue-100 '
                    : 'text-black hover:text-black hover:bg-gray-100'
                }`}
                title={isCollapsed ? label : ''}
              >
                <span className="text-lg mr-3">{icon}</span>
                <span className={`${isCollapsed ? 'hidden' : ''}`}>
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideNavbar;