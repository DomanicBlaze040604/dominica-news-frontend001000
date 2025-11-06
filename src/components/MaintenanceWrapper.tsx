import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

export const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({ children }) => {
  // Check if maintenance mode is enabled
  const isMaintenanceMode = false; // TODO: Connect to your backend settings

  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Under Maintenance
            </h1>
            
            <p className="text-gray-600 mb-6">
              We're currently performing scheduled maintenance to improve your experience. 
              We'll be back shortly!
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Expected downtime: 30 minutes</span>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                For urgent matters, please contact us at{' '}
                <a href="mailto:admin@dominica-news.com" className="text-green-600 hover:underline">
                  admin@dominica-news.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};