interface ChatBubbleProps {
  message: string;
  isAI?: boolean;
}

export default function ChatBubble({ message, isAI = true }: ChatBubbleProps) {
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[80%] ${isAI ? 'mr-auto' : 'ml-auto'}`}>
        {isAI && (
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-[var(--accent-teal)] rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
              A
            </div>
          </div>
        )}        <div
          className={`p-4 rounded-lg ${
            isAI
              ? 'bg-[var(--chat-bubble-bg)] border border-[var(--chat-input-border)] text-[var(--text-dark)]'
              : 'bg-[var(--accent-teal)] text-white'
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
