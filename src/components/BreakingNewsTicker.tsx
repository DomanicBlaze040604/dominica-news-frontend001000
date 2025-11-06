import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface BreakingNews {
  id: string;
  title: string;
  url?: string;
}

export const BreakingNewsTicker: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNews, setCurrentNews] = useState<BreakingNews | null>(null);

  // Mock breaking news - replace with actual API call
  useEffect(() => {
    // TODO: Replace with actual API call to your backend
    const mockBreakingNews: BreakingNews = {
      id: '1',
      title: 'Welcome to Dominica News - Your trusted source for Caribbean updates',
      url: '/'
    };

    // Only show if there's actual breaking news
    // setCurrentNews(mockBreakingNews);
    // setIsVisible(true);
  }, []);

  if (!isVisible || !currentNews) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <AlertCircle className="h-5 w-5 animate-pulse" />
              <span className="font-bold text-sm uppercase tracking-wide">
                Breaking News
              </span>
            </div>
            
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                {currentNews.url ? (
                  <a 
                    href={currentNews.url}
                    className="hover:underline font-medium"
                  >
                    {currentNews.title}
                  </a>
                ) : (
                  <span className="font-medium">{currentNews.title}</span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-red-800 rounded transition-colors ml-4"
            aria-label="Close breaking news"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};