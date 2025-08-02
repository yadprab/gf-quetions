import React from 'react';

const TopNavbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  return (
    <nav className={`fixed top-0 right-0 z-50 bg-white border-b border-gray-200 ${
      sidebarCollapsed ? 'left-16' : 'left-64'
    }`}>
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800">
            Customer Portal
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Welcome back!
          </div>
          
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;