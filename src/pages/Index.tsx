import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dominica News - Breaking News & Caribbean Updates</title>
        <meta name="description" content="Stay informed with the latest news from Dominica and the Caribbean. Breaking news, politics, weather, sports, and more." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Welcome to <span className="text-green-600">Dominica News</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your trusted source for breaking news, politics, weather updates, and Caribbean coverage.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">World News</h3>
                <p className="text-gray-600">Stay updated with international news and global events</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏝️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Local News</h3>
                <p className="text-gray-600">Latest updates from across Dominica and the Caribbean</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Economy</h3>
                <p className="text-gray-600">Business news and economic developments</p>
              </div>
            </div>
            
            <div className="mt-12">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">Backend Integration Ready</h2>
                <p className="text-green-100 mb-4">
                  Please provide your backend URL to complete the setup and enable all features.
                </p>
                <div className="text-sm text-green-200">
                  Current API URL: <code className="bg-green-700 px-2 py-1 rounded">Not configured</code>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;