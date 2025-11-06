import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1) || 'Category';

  return (
    <>
      <Helmet>
        <title>{categoryName} News - Dominica News</title>
        <meta name="description" content={`Latest ${categoryName.toLowerCase()} news from Dominica and the Caribbean.`} />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {categoryName} News
            </h1>
            <p className="text-gray-600 mb-8">
              Latest {categoryName.toLowerCase()} updates from Dominica and the Caribbean
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">
                {categoryName} articles will appear here once the backend is connected.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CategoryPage;