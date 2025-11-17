import React from 'react';

const BlogLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Cover image skeleton */}
        <div className="h-64 md:h-80 lg:h-96 bg-gray-200 rounded-xl mb-8 animate-pulse"></div>

        {/* Title skeleton */}
        <div className="mb-6">
          <div className="h-8 md:h-10 bg-gray-200 rounded mb-3 animate-pulse"></div>
          <div className="h-8 md:h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* Description skeleton */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        </div>

        {/* Meta info skeleton */}
        <div className="flex flex-wrap gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
          ))}
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="bg-white rounded-xl p-8 mb-12 border border-gray-100">
          <div className="space-y-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{
                width: `${Math.random() * 40 + 60}%`
              }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogLoadingSkeleton;