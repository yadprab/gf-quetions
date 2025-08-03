import React from 'react';
import { BsLayoutSidebar } from "react-icons/bs";


const TopNavbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  return (
    <nav className={`fixed top-0 right-0 z-50 bg-white border-b border-gray-200 ${
      sidebarCollapsed ? 'left-16' : 'left-64'
    }`}>
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <BsLayoutSidebar className="w-5 h-5 text-gray-600" />
          </button>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm flex items-center justify-center text-white text-md font-semibold'>G</div>
            <div className='text-xl font-semibold text-gray-800'>Growfin</div>
          </div>
          
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;