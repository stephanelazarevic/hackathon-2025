'use client';

import { useState } from 'react';
import { Conversation } from '../hooks/useConversations';


interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isCollapsed,
  onToggleCollapse
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const truncateTitle = (title: string, maxLength: number = 25) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div className={`bg-[var(--card-bg)] backdrop-blur-md border-r border-[var(--chat-input-border)] flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      
      {/* Header avec bouton collapse */}
      <div className="p-4 border-b border-[var(--chat-input-border)] flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-[var(--text-dark)]">
            💬 Conversations
          </h2>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-[var(--chat-bubble-bg)] text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors"
          title={isCollapsed ? 'Développer' : 'Réduire'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Bouton Nouvelle conversation */}
      <div className="p-4">
        <button
          onClick={onNewConversation}
          className={`w-full bg-[var(--accent-teal)] hover:bg-[var(--accent-teal-dark)] text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isCollapsed ? 'p-3' : 'p-3'
          }`}
          title="Nouvelle conversation"
        >
          <span className="text-lg">+</span>
          {!isCollapsed && <span className="font-medium">Nouvelle conversation</span>}
        </button>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          !isCollapsed && (
            <div className="p-4 text-center text-[var(--text-muted)]">
              <p className="text-sm">Aucune conversation</p>
              <p className="text-xs mt-1">Commencez une nouvelle conversation !</p>
            </div>
          )
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`relative group rounded-lg transition-all cursor-pointer ${
                  conversation.id === currentConversationId
                    ? 'bg-[var(--accent-teal)] bg-opacity-10 border border-[var(--accent-teal)] border-opacity-30'
                    : 'hover:bg-[var(--chat-bubble-bg)] border border-transparent'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
                onMouseEnter={() => setHoveredId(conversation.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
                  {isCollapsed ? (
                    <div className="w-6 h-6 bg-[var(--accent-teal)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {conversation.title.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-[var(--text-dark)] text-sm leading-tight">
                          {truncateTitle(conversation.title)}
                        </h3>
                        <span className="text-xs text-[var(--text-muted)] ml-2 flex-shrink-0">
                          {formatDate(conversation.updatedAt)}
                        </span>
                      </div>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                        {conversation.messages.length > 0 
                          ? conversation.messages[conversation.messages.length - 1].text.slice(0, 50) + '...'
                          : 'Nouvelle conversation'
                        }
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">                        <span className="text-xs text-[var(--text-muted)]">
                          {conversation.messages.length} message{conversation.messages.length > 1 ? 's' : ''}
                        </span>
                        
                        {hoveredId === conversation.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer avec statistiques */}
      {!isCollapsed && conversations.length > 0 && (
        <div className="p-4 border-t border-[var(--chat-input-border)]">          <div className="text-xs text-[var(--text-muted)] text-center">
            {conversations.length} conversation{conversations.length > 1 ? 's' : ''} • 
            {conversations.reduce((total, conv) => total + conv.messages.length, 0)} messages
          </div>
        </div>
      )}
    </div>
  );
}
