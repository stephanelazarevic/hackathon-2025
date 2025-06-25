'use client';

import { useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import StepForm from './StepForm';

interface Message {
  id: number;
  text: string;
  isAI: boolean;
}

interface StepFormData {
  eventType: string;
  projectType: string;
  guests: number;
  budget: number;
  date: string;
  location: string;
  theme: string;
  atmosphere: string;
  priority: string;
  status: string;
  age: number;
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis Evently-AI, votre assistant IA pour l'organisation d'événements. Comment puis-je vous aider à créer un événement extraordinaire aujourd'hui ?",
      isAI: true,
    },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isAI: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Simuler une réponse de l'IA et afficher le formulaire
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "Parfait ! Pour vous proposer les meilleures options, j'ai besoin de quelques informations sur votre projet. Pourriez-vous remplir ce petit formulaire ?",
        isAI: true,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Afficher le formulaire après la réponse
      setTimeout(() => {
        setShowForm(true);
      }, 500);
    }, 1500);
  };  const handleFormSubmit = (formData: StepFormData) => {
    // Traitement des données du formulaire
    console.log('Données du formulaire:', formData);
    
    // Ajouter un message de confirmation plus détaillé
    const confirmationMessage: Message = {
      id: messages.length + 3,
      text: `Parfait ! J'ai bien reçu toutes vos informations. Vous souhaitez organiser un ${formData.eventType} ${formData.projectType} pour ${formData.guests} personnes avec un budget de ${formData.budget}€. Le thème sera ${formData.theme} avec une ambiance ${formData.atmosphere}. Je vais maintenant vous proposer un plan détaillé personnalisé pour votre événement !`,
      isAI: true,
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
    setShowForm(false);
  };

  const handleBackToChat = () => {
    setShowForm(false);
  };
  if (showForm) {
    return (
      <StepForm 
        onComplete={handleFormSubmit}
        onBack={handleBackToChat}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat Messages Area */}
      <div className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--chat-input-border)] rounded-xl p-6 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.text}
            isAI={message.isAI}
          />
        ))}
        
        {/* Indicateur de frappe */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[80%] mr-auto">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-[var(--accent-teal)] rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
                  A
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[var(--chat-bubble-bg)] border border-[var(--chat-input-border)] text-[var(--text-dark)]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[var(--accent-teal)] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[var(--accent-teal)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[var(--accent-teal)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
