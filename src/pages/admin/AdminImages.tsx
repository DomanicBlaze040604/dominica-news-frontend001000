import React from 'react';
import { Helmet } from 'react-helmet-async';

export const AdminImages: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Images - Admin - Dominica News</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Images</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">Image management will be available once backend is connected.</p>
        </div>
      </div>
    </>
  );
};