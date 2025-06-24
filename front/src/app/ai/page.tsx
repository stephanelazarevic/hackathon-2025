'use client';

import { useEffect, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: prompt }];
    setMessages(newMessages);
    setPrompt('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ollama/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, stream: true }),
      });

      if (!response.body) throw new Error('Pas de flux');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let aiResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              aiResponse += json.response;
              setMessages([...newMessages, { role: 'assistant' as const, content: aiResponse }]);
            }
          } catch (e) {
            console.error('Erreur de parsing JSON stream :', line, e);
          }
        }

      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant' as const, content: 'Erreur lors de la requête.' }]);
    } finally {
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
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <textarea
        rows={2}
        placeholder="Pose ta question..."
        className="w-full mt-4 p-2 border rounded focus:outline-none resize-none"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendPrompt();
          }
        }}
      />

      <button
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
        onClick={sendPrompt}
        disabled={loading}
      >
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </main>
  );
}
