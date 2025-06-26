import React from 'react';

interface ChatInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSendMessage: (forceQuestionnaire?: boolean) => void;
  onStopStreaming: () => void;
  loading: boolean;
  isStreaming: boolean;
  questionnaireMode?: boolean;
  currentQuestion?: number;
  totalQuestions?: number;
  showNewQuestionnaireButton?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  prompt,
  setPrompt,
  onSendMessage,
  onStopStreaming,
  loading,
  isStreaming,
  questionnaireMode = false,
  currentQuestion = 0,
  totalQuestions = 0,
  showNewQuestionnaireButton = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleSendMessage = () => {
    onSendMessage();
  };

  const handleNewQuestionnaire = () => {
    onSendMessage(true);
  };

  return (
    <div className="pb-6">
      {questionnaireMode && totalQuestions > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
            <span>Mode questionnaire</span>
            <span>{currentQuestion + 1} / {totalQuestions}</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="rounded-2xl p-4 shadow-sm bg-white border border-gray-200">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              rows={1}
              placeholder="Écrivez votre message à Ervia..."
              className="w-full px-4 py-3 rounded-xl resize-none focus:outline-none transition-all duration-200 bg-gray-50 border border-gray-200 text-gray-800 focus:border-blue-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || isStreaming}
            />
          </div>
          
          {!isStreaming ? (
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 shadow-sm text-white ${
                prompt.trim() && !loading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
              }`}
              onClick={handleSendMessage}
              disabled={loading || !prompt.trim()}
            >
              {loading ? '...' : '→'}
            </button>
          ) : (
            <button
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm bg-gray-800 hover:bg-gray-900 text-white"
              onClick={onStopStreaming}
            >
              ■
            </button>
          )}
        </div>
        
        {/* Bouton pour créer un nouveau questionnaire en conversation normale */}
        {showNewQuestionnaireButton && !questionnaireMode && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={handleNewQuestionnaire}
              className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
              disabled={loading || isStreaming}
            >
              + Créer un nouveau questionnaire avec ce message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
