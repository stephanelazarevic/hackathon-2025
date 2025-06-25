'use client';

import { useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import StepForm from './StepForm';
import EventSummary, { EventSummaryData } from './EventSummary';
import { Conversation, Message } from '../hooks/useConversations';

export interface StepFormData {
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

interface ChatContainerProps {
  conversation: Conversation;
  onAddMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
}

export default function ChatContainer({ conversation, onAddMessage }: ChatContainerProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [eventData, setEventData] = useState<EventSummaryData | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (messageText: string) => {
    // Ajouter le message utilisateur
    onAddMessage({ text: messageText, isAI: false });
    setIsTyping(true);

    // Simuler une réponse de l'IA et afficher le formulaire
    setTimeout(() => {
      const aiResponseText = "Parfait ! Pour vous proposer les meilleures options, j'ai besoin de quelques informations sur votre projet. Pourriez-vous remplir ce petit formulaire ?";
      
      onAddMessage({ text: aiResponseText, isAI: true });
      setIsTyping(false);
      
      // Afficher le formulaire après la réponse
      setTimeout(() => {
        setShowForm(true);
      }, 500);
    }, 1500);
  };  const handleFormSubmit = (formData: StepFormData) => {
    // Traitement des données du formulaire
    console.log('Données du formulaire:', formData);
    
    // Ajouter un message de confirmation détaillé
    const confirmationText = `Parfait ! J'ai bien reçu toutes vos informations. Vous souhaitez organiser un ${formData.eventType} ${formData.projectType} pour ${formData.guests} personnes avec un budget de ${formData.budget}€. Le thème sera ${formData.theme} avec une ambiance ${formData.atmosphere}. Je vais maintenant générer votre plan détaillé personnalisé !`;
    
    onAddMessage({ text: confirmationText, isAI: true });
    setShowForm(false);
    
    // Créer les données du résumé avec des recommandations
    const summaryData: EventSummaryData = {
      ...formData,
      generatedAt: new Date().toISOString()
    };
    
    setEventData(summaryData);
    
    // Afficher le résumé après un court délai
    setTimeout(() => {
      setShowSummary(true);
    }, 2000);
  };
  const handleBackToChat = () => {
    setShowForm(false);
    setShowSummary(false);
  };

  if (showSummary && eventData) {
    return (
      <EventSummary 
        data={eventData}
        onBackToChat={handleBackToChat}
      />
    );
  }

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
      {/* Chat Messages Area */}      <div className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--chat-input-border)] rounded-xl p-6 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
        {conversation.messages.map((message) => (
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
