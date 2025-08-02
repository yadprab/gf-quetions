
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/invoices', label: 'Invoices' },
    { path: '/customers', label: 'Customers' },
    { path: '/customer-details', label: 'Customer Details' },
    { path: '/settings', label: 'Settings' }
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 mx-1 rounded-md font-medium text-sm transition-all duration-200 ${
                isActive(path)
                  ? 'bg-blue-500 !text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;