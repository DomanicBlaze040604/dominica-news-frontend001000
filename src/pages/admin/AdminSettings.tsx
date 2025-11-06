import React from 'react';
import { Helmet } from 'react-helmet-async';

const AdminSettings: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Settings - Admin - Dominica News</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">Settings management will be available once backend is connected.</p>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;