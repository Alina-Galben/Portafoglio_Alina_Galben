import React, { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  isMobile?: boolean;
  priority?: boolean;
}

const OptimizedImage: React.FC<Props> = ({ src, alt, className = '', isMobile, priority }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  if (status === 'error') {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <span className="text-sm text-gray-400">N/A</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-violet-500" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : isMobile ? 'low' : 'auto'}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: isMobile ? '300px' : '400px'
        }}
      />
    </div>
  );
};

export default OptimizedImage;