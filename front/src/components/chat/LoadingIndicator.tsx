import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="mb-6 flex justify-start">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm bg-blue-500">
          <span className="text-sm">E</span>
        </div>
        
        <div className="rounded-2xl px-4 py-3 shadow-sm bg-gray-100 border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-bounce bg-gray-400" />
            <div className="w-2 h-2 rounded-full animate-bounce-delay-1 bg-gray-400" />
            <div className="w-2 h-2 rounded-full animate-bounce-delay-2 bg-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
