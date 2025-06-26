import React from 'react';

const ChatHeader: React.FC = () => {
  return (
    <div className="sticky top-0 z-30 text-center py-3 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-2xl font-black mb-1 text-black tracking-tight">
          Ervia
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          Assistant IA moderne pour vos évènements
        </p>
        <div className="mt-2 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
      </div>
    </div>
  );
};

export default ChatHeader;
