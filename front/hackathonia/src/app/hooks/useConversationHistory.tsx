'use client';

import { useState, useEffect } from 'react';
import { Conversation } from '../components/Sidebar';

export interface Message {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: string;
}

export interface ConversationData {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'evently-conversations';

export const useConversationHistory = () => {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Charger les conversations depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedConversations = JSON.parse(saved);
        setConversations(parsedConversations);
        
        // Sélectionner la dernière conversation par défaut
        if (parsedConversations.length > 0) {
          const lastConversation = parsedConversations.sort(
            (a: ConversationData, b: ConversationData) => 
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          setCurrentConversationId(lastConversation.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des conversations:', error);
      }
    }
  }, []);

  // Sauvegarder dans localStorage quand les conversations changent
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  // Générer un titre automatique basé sur le premier message utilisateur
  const generateTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find(msg => !msg.isAI);
    if (firstUserMessage) {
      const title = firstUserMessage.text.substring(0, 30);
      return title.length < firstUserMessage.text.length ? title + '...' : title;
    }
    return 'Nouvelle conversation';
  };

  // Créer une nouvelle conversation
  const createNewConversation = (): string => {
    const now = new Date().toISOString();
    const newConversation: ConversationData = {
      id: `conv_${Date.now()}`,
      title: 'Nouvelle conversation',
      messages: [{
        id: 1,
        text: "Bonjour ! Je suis Evently-AI, votre assistant IA pour l'organisation d'événements. Comment puis-je vous aider à créer un événement extraordinaire aujourd'hui ?",
        isAI: true,
        timestamp: now
      }],
      createdAt: now,
      updatedAt: now
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    return newConversation.id;
  };

  // Obtenir la conversation actuelle
  const getCurrentConversation = (): ConversationData | null => {
    if (!currentConversationId) return null;
    return conversations.find(conv => conv.id === currentConversationId) || null;
  };

  // Ajouter un message à la conversation actuelle
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!currentConversationId) return;

    const timestamp = new Date().toISOString();
    const newMessage: Message = {
      ...message,
      id: Date.now(),
      timestamp
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, newMessage];
        const updatedConv = {
          ...conv,
          messages: updatedMessages,
          updatedAt: timestamp,
          title: conv.title === 'Nouvelle conversation' ? generateTitle(updatedMessages) : conv.title
        };
        return updatedConv;
      }
      return conv;
    }));
  };

  // Sélectionner une conversation
  const selectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  // Supprimer une conversation
  const deleteConversation = (conversationId: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== conversationId);
      
      // Si on supprime la conversation actuelle, sélectionner la plus récente
      if (conversationId === currentConversationId) {
        if (filtered.length > 0) {
          const mostRecent = filtered.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          setCurrentConversationId(mostRecent.id);
        } else {
          setCurrentConversationId(null);
        }
      }
      
      return filtered;
    });
  };

  // Mettre à jour les messages de la conversation actuelle
  const updateCurrentConversationMessages = (messages: Message[]) => {
    if (!currentConversationId) return;

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages,
          updatedAt: new Date().toISOString(),
          title: conv.title === 'Nouvelle conversation' ? generateTitle(messages) : conv.title
        };
      }
      return conv;
    }));
  };

  // Convertir les conversations pour la sidebar
  const getSidebarConversations = (): Conversation[] => {
    return conversations
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map(conv => ({
        id: conv.id,
        title: conv.title,
        lastMessage: conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].text : '',
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        messageCount: conv.messages.length
      }));
  };

  return {
    conversations: getSidebarConversations(),
    currentConversationId,
    currentConversation: getCurrentConversation(),
    createNewConversation,
    selectConversation,
    deleteConversation,
    addMessage,
    updateCurrentConversationMessages
  };
};
