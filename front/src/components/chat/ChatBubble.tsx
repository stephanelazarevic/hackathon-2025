import React from 'react';
import Image from 'next/image';

interface ChatBubbleProps {
  message: string;
  role: 'user' | 'assistant';
  isStreaming?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, role, isStreaming = false }) => {
  return (
    <div className={`mb-6 flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-4 max-w-[85%] ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div 
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm ${
            role === 'user' 
              ? 'bg-gray-900 text-white' 
              : 'bg-white border border-gray-200 p-1'
          }`}
        >
          {role === 'user' ? (
            <span>U</span>
          ) : (
            <Image 
              src="/img/ervia_small_logo.png" 
              alt="Ervia Assistant" 
              width={32} 
              height={32} 
              className="rounded-lg object-contain"
            />
          )}
        </div>
        
        {/* Message bubble */}
        <div 
          className={`rounded-2xl px-4 py-3 shadow-sm max-w-md ${
            role === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-black border border-gray-200'
          }`}
        >
          <div className="whitespace-pre-wrap leading-relaxed text-sm">
            {message}
            {isStreaming && (
              <span className={`inline-block w-0.5 h-4 ml-1 animate-pulse ${
                role === 'user' ? 'bg-white' : 'bg-gray-400'
              }`}>|</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
