import React from 'react';
import useDeviceOptimization from '../hooks/useDeviceOptimization';

const SimpleMobilePage = ({ title, children, className = "" }) => {
  const { isMobile } = useDeviceOptimization();

  if (!isMobile) {
    return children;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header semplice */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white p-6 text-center">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      {/* Loading placeholder per mobile */}
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="text-sm text-gray-500">
            Caricamento ottimizzato per mobile in corso...
          </div>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
              Ricarica se necessario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMobilePage;