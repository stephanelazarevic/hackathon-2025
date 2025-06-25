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
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setPrompt('');
    setLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortControllerRef.current.signal,
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

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Requête annulée');
      } else {
        console.error('Erreur lors de la requête:', err);
        setMessages(prevMessages => [...prevMessages.slice(0, -1), { 
          role: 'assistant', 
          content: 'Erreur lors de la requête au serveur.' 
        }]);
      }
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="max-w-2xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Assistant IA</h1>

      <div className="bg-white border rounded p-4 h-[60vh] overflow-y-auto shadow">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center mt-8">
            Commencez une conversation avec votre assistant IA...
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block px-4 py-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white ml-auto' 
                  : 'bg-gray-200 text-black mr-auto'
              }`}
            >
              {msg.content}
              {msg.isStreaming && (
                <span className="inline-block w-2 h-5 bg-gray-600 ml-1 animate-pulse">|</span>
              )}
            </span>
          </div>
        ))}
        
        {loading && (
          <div className="text-left mb-3">
            <span className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4">
        <textarea
          rows={2}
          placeholder="Pose ta question..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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

        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={sendPrompt}
            disabled={loading || !prompt.trim() || isStreaming}
          >
            {loading ? 'Envoi...' : isStreaming ? 'IA en train d\'écrire...' : 'Envoyer'}
          </button>
          
          {isStreaming && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              onClick={stopStreaming}
            >
              Arrêter
            </button>
          )}
        </div>
      </div>
    </main>
  );
}