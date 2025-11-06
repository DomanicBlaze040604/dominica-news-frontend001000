import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminArticles: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Articles - Admin - Dominica News</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600">Manage your news articles</p>
          </div>
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Link>
        </div>

        {/* Search and filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Articles list placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600 mb-4">
              Backend integration pending. Articles will appear here once connected to your API.
            </p>
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create First Article
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};