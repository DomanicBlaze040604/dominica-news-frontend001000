import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Dominica News</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to Dominica News homepage." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">DN</span>
              </div>
            </Link>
          </div>

          {/* 404 Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-8xl font-bold text-green-600 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>

            <div className="space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Home className="h-5 w-5" />
                Go to Homepage
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
              <div className="flex gap-2">
                <Link
                  to="/category/dominica"
                  className="flex-1 text-center px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Local News
                </Link>
                <Link
                  to="/category/world"
                  className="flex-1 text-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  World News
                </Link>
                <Link
                  to="/contact"
                  className="flex-1 text-center px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;