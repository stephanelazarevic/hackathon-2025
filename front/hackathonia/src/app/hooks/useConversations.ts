'use client';

import { useState, useEffect } from 'react';

export interface Message {
  id: number;
  text: string;
  isAI: boolean;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  eventData?: any;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  // Charger les conversations depuis localStorage au démarrage
  useEffect(() => {
    const savedConversations = localStorage.getItem('evently-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);
        
        // Sélectionner la dernière conversation
        if (parsed.length > 0) {
          setCurrentConversationId(parsed[0].id);
        } else {
          // Créer une nouvelle conversation si le tableau est vide
          createNewConversationInitial();
        }
      } catch (error) {
        console.error('Erreur lors du chargement des conversations:', error);
        createNewConversationInitial();
      }
    } else {
      // Aucune conversation sauvegardée, créer la première
      createNewConversationInitial();
    }
  }, []);

  // Sauvegarder les conversations dans localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('evently-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Obtenir la conversation actuelle
  const getCurrentConversation = (): Conversation | null => {
    if (!currentConversationId) return null;
    return conversations.find(conv => conv.id === currentConversationId) || null;
  };
  // Créer une nouvelle conversation initiale (sans la mettre en haut)
  const createNewConversationInitial = (): string => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: 'Nouvelle conversation',
      messages: [{
        id: 1,
        text: "Bonjour ! Je suis Evently-AI, votre assistant IA pour l'organisation d'événements. Comment puis-je vous aider à créer un événement extraordinaire aujourd'hui ?",
        isAI: true,
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setConversations([newConversation]);
    setCurrentConversationId(newId);
    return newId;
  };

  // Créer une nouvelle conversation
  const createNewConversation = (): string => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: 'Nouvelle conversation',
      messages: [{
        id: 1,
        text: "Bonjour ! Je suis Evently-AI, votre assistant IA pour l'organisation d'événements. Comment puis-je vous aider à créer un événement extraordinaire aujourd'hui ?",
        isAI: true,
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    return newId;
  };

  // Sélectionner une conversation
  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  // Ajouter un message à la conversation actuelle
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!currentConversationId) return;

    const newMessage: Message = {
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, newMessage],
          updatedAt: new Date().toISOString()
        };

        // Mettre à jour le titre basé sur le premier message utilisateur
        if (!message.isAI && conv.title === 'Nouvelle conversation') {
          updatedConv.title = message.text.slice(0, 50) + (message.text.length > 50 ? '...' : '');
        }

        return updatedConv;
      }
      return conv;
    }));
  };

  // Supprimer une conversation
  const deleteConversation = (id: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id);
      
      // Si on supprime la conversation actuelle, sélectionner une autre
      if (id === currentConversationId) {
        if (filtered.length > 0) {
          setCurrentConversationId(filtered[0].id);
        } else {
          // Créer une nouvelle conversation si plus aucune
          const newId = createNewConversation();
          return prev; // La nouvelle conversation sera ajoutée par createNewConversation
        }
      }
      
      return filtered;
    });
  };

  // Mettre à jour les données d'événement d'une conversation
  const updateEventData = (eventData: any) => {
    if (!currentConversationId) return;

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          eventData,
          updatedAt: new Date().toISOString()
        };
      }
      return conv;
    }));
  };

  // Nettoyer toutes les conversations (utile pour le dev)
  const clearAllConversations = () => {
    setConversations([]);
    setCurrentConversationId(null);
    localStorage.removeItem('evently-conversations');
  };

  return {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createNewConversation,
    selectConversation,
    addMessage,
    deleteConversation,
    updateEventData,
    clearAllConversations
  };
}
