import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

export default function ChatInput({ onSendMessage, placeholder = "Écrivez votre message à Evently-AI..." }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center bg-[var(--input-bg)] border border-[var(--chat-input-border)] rounded-lg overflow-hidden backdrop-blur-sm">        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-transparent text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none"
        />        <button
          type="submit"
          className="p-3 bg-[var(--accent-teal)] hover:bg-[var(--accent-teal-dark)] transition-colors duration-200 text-white"
          disabled={!message.trim()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 21L23 12L2 3V10L17 12L2 14V21Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
