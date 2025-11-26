import React from 'react';
import useDeviceOptimization from '../hooks/useDeviceOptimization';

const LoadingDots = () => (
  <div className="flex justify-center space-x-2 mb-4">
    {[0, 100, 200].map((delay) => (
      <div
        key={delay}
        className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </div>
);

export default function MobileLoading({ message = "Caricamento..." }: { message?: string }) {
  const { isMobile } = useDeviceOptimization();

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-xs">
        <div className="w-16 h-16 mx-auto mb-6 bg-linear-to-br from-violet-600 to-purple-700 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl animate-pulse">AG</span>
        </div>
        <LoadingDots />
        <p className="text-gray-700 text-sm font-medium">{message}</p>
        <p className="text-gray-500 text-xs mt-2">Ottimizzando per dispositivi mobile...</p>
      </div>
    </div>
  );
}