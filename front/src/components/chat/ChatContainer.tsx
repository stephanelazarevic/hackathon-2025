import React, { forwardRef } from 'react';
import ChatBubble from './ChatBubble';
import WelcomeMessage from './WelcomeMessage';
import LoadingIndicator from './LoadingIndicator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface ChatContainerProps {
  messages: Message[];
  loading: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(
  ({ messages, loading, onSuggestionClick }, ref) => {
    return (
      <div 
        className="rounded-2xl p-6 mb-6 shadow-sm bg-white border border-gray-200 overflow-y-auto min-h-[500px] max-h-[600px]"
      >
        {messages.length === 0 && <WelcomeMessage onSuggestionClick={onSuggestionClick} />}
        
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            message={msg.content}
            role={msg.role}
            isStreaming={msg.isStreaming}
          />
        ))}
        
        {loading && <LoadingIndicator />}
        
        <div ref={ref} />
      </div>
    );
  }
);

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;
