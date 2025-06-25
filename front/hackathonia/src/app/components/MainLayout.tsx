'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatContainer from './ChatContainer';
import { useConversations } from '../hooks/useConversations';

export default function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createNewConversation,
    selectConversation,
    deleteConversation,
    addMessage
  } = useConversations();

  const currentConversation = getCurrentConversation();

  const handleNewConversation = () => {
    createNewConversation();
  };

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId);
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      deleteConversation(conversationId);
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[var(--bg-light)] via-[var(--bg-gradient-middle)] to-[var(--bg-gradient-end)]">
      
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Zone principale */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header principal */}
        <div className="bg-[var(--card-bg)] backdrop-blur-md border-b border-[var(--chat-input-border)] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--accent-teal)] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-dark)]">Evently-AI</h1>
                <p className="text-sm text-[var(--text-muted)]">Assistant IA pour l'organisation d'événements</p>
              </div>
            </div>
            
            {currentConversation && (
              <div className="text-right">
                <h2 className="text-sm font-medium text-[var(--text-dark)]">
                  {currentConversation.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  {currentConversation.messages.length} message{currentConversation.messages.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Zone de contenu */}
        <div className="flex-1 overflow-hidden p-6">          {currentConversation ? (
            <ChatContainer
              conversation={currentConversation}
              onAddMessage={addMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--accent-teal)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-2">
                  Bienvenue sur Evently-AI
                </h2>
                <p className="text-[var(--text-muted)] mb-6 max-w-md">
                  Votre assistant IA pour organiser des événements extraordinaires. 
                  Commencez une nouvelle conversation pour débuter !
                </p>
                <button
                  onClick={createNewConversation}
                  className="bg-[var(--accent-teal)] hover:bg-[var(--accent-teal-dark)] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  🎉 Commencer une nouvelle conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
