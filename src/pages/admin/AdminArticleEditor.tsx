import React from 'react';
import { Helmet } from 'react-helmet-async';

export const AdminArticleEditor: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Article Editor - Admin - Dominica News</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Article Editor</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">Article editor will be available once backend is connected.</p>
        </div>
      </div>
    </>
  );
};