'use client';

import { useEffect, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
};

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/agent/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const messagesWithEmptyAssistant = [...newMessages, { 
        role: 'assistant' as const, 
        content: '', 
        isStreaming: true 
      }];
      setMessages(messagesWithEmptyAssistant);
      setLoading(false);
      setIsStreaming(true);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'chunk') {
                  setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    const lastMessageIndex = newMessages.length - 1;
                    if (newMessages[lastMessageIndex]?.role === 'assistant') {
                      newMessages[lastMessageIndex] = {
                        ...newMessages[lastMessageIndex],
                        content: data.fullContent,
                        isStreaming: true
                      };
                    }
                    return newMessages;
                  });
                } else if (data.type === 'end') {
                  setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    const lastMessageIndex = newMessages.length - 1;
                    if (newMessages[lastMessageIndex]?.role === 'assistant') {
                      newMessages[lastMessageIndex] = {
                        ...newMessages[lastMessageIndex],
                        content: data.fullContent,
                        isStreaming: false
                      };
                    }
                    return newMessages;
                  });
                  setIsStreaming(false);
                } else if (data.type === 'error') {
                  console.error('Erreur streaming:', data.error);
                  setMessages(prevMessages => [...prevMessages.slice(0, -1), {
                    role: 'assistant',
                    content: 'Erreur lors du streaming de la réponse.'
                  }]);
                  setIsStreaming(false);
                }
              } catch (e) {
                console.error('Erreur parsing JSON:', e);
              }
            }
          }
        }
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Erreur lors de la requête:', err.message);
      } else {
        console.error('Erreur inconnue:', err);
      }

      setLoading(false);
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
  <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
    {/* En-tête décoratif */}
    <header className="bg-white shadow-sm border-b py-4 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Assistant IA - Mode Local
        </h1>
      </div>
    </header>

    <div className="flex-1 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 border">
        {/* Messages */}
        <div className="h-[60vh] overflow-y-auto space-y-3 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-12">
              Commencez une conversation avec votre assistant IA local...
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
                {msg.isStreaming && (
                  <span className="inline-block w-2 h-5 bg-gray-600 ml-1 animate-pulse">|</span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-left text-sm text-gray-500 flex gap-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div>
          <textarea
            rows={2}
            placeholder="Pose ta question..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendPrompt();
              }
            }}
            disabled={loading || isStreaming}
          />

          <button
            className="w-full mt-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            onClick={sendPrompt}
            disabled={loading || !prompt.trim() || isStreaming}
          >
            {loading || isStreaming ? "IA en train d'écrire..." : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  </main>
);
;
}
