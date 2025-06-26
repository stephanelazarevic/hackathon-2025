import React from 'react';
import Image from 'next/image';

const ChatHeader: React.FC = () => {
  return (
    <div className="sticky top-0 z-30 text-center py-3 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-6">
        <div className='flex items-center justify-center mb-2'>
          <Image
            src="/img/ervia_text_logo.png"
            alt="Ervia Logo"
            width={128}
            height={64}
            priority
          />
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Assistant IA moderne pour vos évènements
        </p>
        <div className="mt-2 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
      </div>
    </div>
  );
};

export default ChatHeader;
