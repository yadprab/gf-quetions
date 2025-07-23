import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-page min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">GrowFn</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Your modern accounts receivable automation platform designed to streamline 
            invoice management, enhance customer relationships, and boost your business growth.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Get started by exploring your dashboard to view key metrics, manage invoices, 
            and track your business performance in real-time.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-12">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:text-white transition-colors duration-200 shadow-lg hover:shadow-xl hover:underline"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About GrowFn</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            GrowFn is a comprehensive platform designed to automate and streamline your accounts receivable 
            processes. Built with modern technology and user experience in mind, it helps businesses of all 
            sizes manage their invoicing, customer relationships, and financial tracking efficiently.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our platform combines powerful features with an intuitive interface, making it easy for your 
            team to focus on what matters most - growing your business and serving your customers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 