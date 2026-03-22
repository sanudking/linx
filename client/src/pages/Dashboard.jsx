import React from 'react';
import DashboardComponent from '../components/dashboard/Dashboard';

const DashboardPage = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-manrope font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Your academic collaboration hub</p>
        </div>
        <DashboardComponent />
      </div>
    </div>
  );
};

export default DashboardPage;
