import React from 'react';
import useDeviceOptimization from '../hooks/useDeviceOptimization';

interface MobileLoadingProps {
  message?: string;
}

const MobileLoading: React.FC<MobileLoadingProps> = ({ message = "Caricamento..." }) => {
  const { isMobile } = useDeviceOptimization();

  if (!isMobile) {
    // Rendering semplice per desktop
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  // Versione mobile ottimizzata
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-xs">
        {/* Logo animato semplice */}
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-600 to-purple-700 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl animate-pulse">AG</span>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <p className="text-gray-700 text-sm font-medium">{message}</p>
        <p className="text-gray-500 text-xs mt-2">Ottimizzando per dispositivi mobile...</p>
      </div>
    </div>
  );
};

export default MobileLoading;