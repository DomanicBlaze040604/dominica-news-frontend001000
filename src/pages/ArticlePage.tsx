import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Calendar, User, Share2 } from 'lucide-react';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <>
      <Helmet>
        <title>Article - Dominica News</title>
        <meta name="description" content="Read the latest news article from Dominica News." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Article Header */}
            <div className="p-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  News
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Article Title Will Load From Backend
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Author Name</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Publication Date</span>
                </div>
                <button className="flex items-center gap-2 hover:text-green-600 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Article Image Placeholder */}
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Article Image</span>
            </div>

            {/* Article Content */}
            <div className="p-8">
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Article content will be loaded from your backend API once connected. 
                  This will include the full article text, images, and any embedded media.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-700 text-sm">
                    <strong>Backend Integration Pending:</strong> Article with slug "{slug}" 
                    will be fetched from your API once the backend URL is configured.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </>
  );
};

export default ArticlePage;