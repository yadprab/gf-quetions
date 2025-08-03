import React from 'react';

interface LoaderProps {
  variant: 'metrics' | 'card';
  title?: string;
}

const Loader: React.FC<LoaderProps> = ({ variant, title }) => {
  const renderMetricsLoader = () => (
    <div className="flex gap-4 mt-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col w-1/4 gap-2 bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
          <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCardLoader = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {title && (
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
      )}
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (variant) {
    case 'metrics':
      return renderMetricsLoader();
    case 'card':
      return renderCardLoader();
    default:
      return null;
  }
};

export default Loader;