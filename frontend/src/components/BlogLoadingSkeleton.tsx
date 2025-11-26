import React from 'react';

const Skeleton = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className || ''}`} style={style} />
);

export default function BlogLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center space-x-2 mb-8">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <Skeleton className="h-64 md:h-80 lg:h-96 rounded-xl mb-8" />

        <div className="mb-6 space-y-3">
          <Skeleton className="h-8 md:h-10 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-20" />
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 mb-12 border border-gray-100 space-y-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-4" 
              style={{ width: `${Math.random() * 40 + 60}%` }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}