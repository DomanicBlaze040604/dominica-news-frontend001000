import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

const StaticPageDisplay: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const getPageTitle = (slug?: string) => {
    switch (slug) {
      case 'about': return 'About Us';
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'editorial-team': return 'Editorial Team';
      default: return 'Page';
    }
  };

  const pageTitle = getPageTitle(slug);

  return (
    <>
      <Helmet>
        <title>{pageTitle} - Dominica News</title>
        <meta name="description" content={`${pageTitle} page for Dominica News.`} />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                This {pageTitle.toLowerCase()} content will be loaded from your backend once connected.
              </p>
              
              {slug === 'about' && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Dominica News is your trusted source for breaking news, politics, weather updates, 
                    sports, entertainment, and comprehensive Caribbean coverage.
                  </p>
                  <p className="text-gray-600">
                    We are committed to delivering accurate, timely, and relevant news to the people 
                    of Dominica and the wider Caribbean community.
                  </p>
                </div>
              )}
              
              {slug === 'privacy' && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Your privacy is important to us. This privacy policy will be populated with 
                    detailed information about how we collect, use, and protect your personal data.
                  </p>
                </div>
              )}
              
              {slug === 'terms' && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    These terms of service will outline the rules and regulations for using 
                    the Dominica News website and services.
                  </p>
                </div>
              )}
              
              {slug === 'editorial-team' && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Meet our dedicated editorial team committed to bringing you the latest 
                    news and updates from Dominica and the Caribbean.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StaticPageDisplay;