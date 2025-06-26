'use client';

import React, { useState, useRef, useEffect } from 'react';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import ChatHeader from '@/components/chat/ChatHeader';
import SummaryPanel from '@/components/chat/SummaryPanel';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface Question {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'number' | 'date';
  options?: string[];
  required: boolean;
}

interface QuestionnaireData {
  title: string;
  description: string;
  questions: Question[];
}

interface FillInTheBlankQuestion {
  id: string;
  text: string;
  blanks: Array<{
    id: string;
    type: 'text' | 'choice' | 'number' | 'date';
    options?: string[];
    placeholder?: string;
  }>;
}

interface QuestionAnswerPair {
  questionId: string;
  question: string;
  answer: string;
  questionNumber: number;
}

function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // État pour le mode questionnaire
  const [fillInTheBlankMode, setFillInTheBlankMode] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [fillInTheBlankQuestions, setFillInTheBlankQuestions] = useState<FillInTheBlankQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [questionAnswerPairs, setQuestionAnswerPairs] = useState<QuestionAnswerPair[]>([]);
  const [originalUserRequest, setOriginalUserRequest] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    // Déclencher automatiquement l'envoi
    setTimeout(() => {
      sendPromptWithText(suggestion);
    }, 100);
  };

  const sendPromptWithText = async (text: string, forceQuestionnaire: boolean = false) => {
    if (!text.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setPrompt('');
    setLoading(true);

    try {
      // Si on est en conversation normale (après questionnaire) et pas forcé à créer un questionnaire
      if (!forceQuestionnaire && messages.length > 0 && !fillInTheBlankMode) {
        // Chat normal avec l'IA
        const contextSummary = questionAnswerPairs.length > 0 
          ? `L'utilisateur a complété un questionnaire avec ${questionAnswerPairs.length} réponses: ${questionAnswerPairs.map(p => `${p.question}: ${p.answer}`).join('; ')}`
          : '';

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: text }],
            context: contextSummary
          })
        });

        if (!response.ok) throw new Error('Erreur lors du chat');

        const result = await response.json();
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: result.response
        }]);
        
      } else {
        // Première interaction ou nouvelle discussion - générer un questionnaire
        setOriginalUserRequest(text); // Stocker la demande originale
        
        const response = await fetch('/api/generate-questionnaire', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userRequest: text })
        });

        if (!response.ok) throw new Error('Erreur lors de la génération du questionnaire');

        const questionnaire: QuestionnaireData = await response.json();
        
        // Convertir en format phrase à trou
        const fillInQuestions = convertToFillInTheBlank(questionnaire);
        
        setQuestionnaireData(questionnaire);
        setFillInTheBlankQuestions(fillInQuestions);
        setFillInTheBlankMode(true);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        
        // Ajouter le message de l'assistant
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Parfait ! Je vais vous poser quelques questions pour mieux comprendre votre besoin. Complétez les phrases suivantes :`
        }]);
      }
        
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendPrompt = async (forceQuestionnaire: boolean = false) => {
    await sendPromptWithText(prompt, forceQuestionnaire);
  };

  const convertToFillInTheBlank = (questionnaire: QuestionnaireData): FillInTheBlankQuestion[] => {
    return questionnaire.questions.map((q) => {
      // Nettoyer la question et l'adapter au format phrase à trou
      let questionText = q.question.replace(/[?!]/g, '').trim();
      
      // S'assurer que la phrase se termine bien pour accueillir la réponse
      if (!questionText.endsWith(':') && !questionText.endsWith(' ')) {
        questionText += ' :';
      } else if (questionText.endsWith(':')) {
        // Garder les deux points
      } else {
        questionText += ' :';
      }
      
      questionText += ' ___________';

      switch (q.type) {
        case 'choice':
          return {
            id: q.id,
            text: questionText,
            blanks: [{
              id: `${q.id}_answer`,
              type: 'choice',
              options: q.options,
              placeholder: 'Choisissez une option'
            }]
          };
        case 'date':
          return {
            id: q.id,
            text: questionText,
            blanks: [{
              id: `${q.id}_answer`,
              type: 'date',
              placeholder: 'Sélectionnez une date'
            }]
          };
        case 'number':
          return {
            id: q.id,
            text: questionText,
            blanks: [{
              id: `${q.id}_answer`,
              type: 'number',
              placeholder: 'Entrez un nombre'
            }]
          };
        default:
          return {
            id: q.id,
            text: questionText,
            blanks: [{
              id: `${q.id}_answer`,
              type: 'text',
              placeholder: 'Votre réponse ici'
            }]
          };
      }
    });
  };

  const handleBlankAnswer = (questionId: string, blankId: string, value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
  };

  const goToNextQuestion = () => {
    // Ajouter la réponse actuelle à l'historique
    if (currentQuestion) {
      const currentAnswer = userAnswers[currentQuestion.blanks[0]?.id];
      if (currentAnswer) {
        const questionText = questionnaireData?.questions[currentQuestionIndex]?.question || currentQuestion.text.replace(' : ___________', '');
        setQuestionAnswerPairs(prev => [
          ...prev,
          {
            questionId: currentQuestion.id,
            question: questionText,
            answer: currentAnswer,
            questionNumber: currentQuestionIndex + 1
          }
        ]);
      }
    }

    if (currentQuestionIndex < fillInTheBlankQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Toutes les questions sont terminées, traiter les réponses
      processFinalAnswers();
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Supprimer la dernière paire question-réponse si on revient en arrière
      setQuestionAnswerPairs(prev => prev.slice(0, -1));
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const processFinalAnswers = async () => {
    setLoading(true);
    
    try {
      // Convertir les réponses pour matcher l'API
      const processedAnswers: Record<string, string> = {};
      fillInTheBlankQuestions.forEach((question) => {
        const blankId = `${question.id}_answer`;
        const answer = userAnswers[blankId];
        if (answer) {
          processedAnswers[question.id] = answer;
        }
      });

      const response = await fetch('/api/process-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionnaire: questionnaireData,
          answers: processedAnswers
        })
      });

      if (!response.ok) throw new Error('Erreur lors du traitement des réponses');

      const result = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.finalResponse
      }]);
      
      // Réinitialiser les modes (mais garder l'historique des questions/réponses)
      setFillInTheBlankMode(false);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, une erreur est survenue lors du traitement de vos réponses.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setLoading(false);
    }
  };

  const resetForNewQuestionnaire = () => {
    setQuestionAnswerPairs([]);
    setFillInTheBlankMode(false);
    setQuestionnaireData(null);
    setFillInTheBlankQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setOriginalUserRequest('');
  };

  const startNewDiscussion = () => {
    setMessages([]);
    setQuestionAnswerPairs([]);
    setFillInTheBlankMode(false);
    setQuestionnaireData(null);
    setFillInTheBlankQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setPrompt('');
    setLoading(false);
    setIsStreaming(false);
    setOriginalUserRequest('');
  };

  const generateReport = () => {
    if (!questionnaireData || questionAnswerPairs.length === 0) {
      alert('Aucun questionnaire terminé trouvé pour générer un rapport.');
      return;
    }

    // Construire les données pour le rapport
    const answers: Record<string, string> = {};
    questionAnswerPairs.forEach(pair => {
      // Trouver l'ID de question correspondant
      const question = questionnaireData.questions.find(q => q.question === pair.question);
      if (question) {
        answers[question.id] = pair.answer;
      }
    });

    const reportData = {
      questionnaire: questionnaireData,
      answers,
      userRequest: originalUserRequest
    };

    // Encoder les données et rediriger vers la page de rapport
    const encodedData = encodeURIComponent(JSON.stringify(reportData));
    window.open(`/report?data=${encodedData}`, '_blank');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const currentQuestion = fillInTheBlankQuestions[currentQuestionIndex];
  const currentQuestionData = questionnaireData?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatHeader />

      <div className="flex-1 flex pt-20">
        {/* Zone de chat principale */}
        <div className="flex-1 px-6 max-w-4xl mx-auto">
          <ChatContainer 
            messages={messages}
            loading={loading}
            onSuggestionClick={handleSuggestionClick}
            ref={messagesEndRef}
          />

          {/* Mode Fill-in-the-blank */}
          {fillInTheBlankMode && currentQuestion && (
            <div className="mb-6 p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
              {/* En-tête avec progrès */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="font-medium">Question {currentQuestionIndex + 1} sur {fillInTheBlankQuestions.length}</span>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                    {Math.round(((currentQuestionIndex + 1) / fillInTheBlankQuestions.length) * 100)}% complété
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / fillInTheBlankQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question avec phrase à trou */}
              <div className="text-xl text-gray-800 mb-8 leading-relaxed font-medium">
                {currentQuestion.text.split('___________').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < currentQuestion.blanks.length && (
                      <span className="inline-block mx-2 relative">
                        {currentQuestion.blanks[index].type === 'choice' ? (
                          <select
                            className="px-6 py-3 border-2 border-blue-200 rounded-xl bg-blue-50 focus:outline-none focus:border-blue-500 focus:bg-white text-blue-700 font-semibold min-w-[250px] transition-all duration-200 cursor-pointer hover:border-blue-300"
                            value={userAnswers[currentQuestion.blanks[index].id] || ''}
                            onChange={(e) => handleBlankAnswer(currentQuestion.id, currentQuestion.blanks[index].id, e.target.value)}
                          >
                            <option value="" className="text-gray-400">{currentQuestion.blanks[index].placeholder}</option>
                            {currentQuestion.blanks[index].options?.map((option, optIndex) => (
                              <option key={optIndex} value={option} className="text-gray-700">{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={currentQuestion.blanks[index].type === 'date' ? 'date' : currentQuestion.blanks[index].type === 'number' ? 'number' : 'text'}
                            className="px-6 py-3 border-2 border-blue-200 rounded-xl bg-blue-50 focus:outline-none focus:border-blue-500 focus:bg-white text-blue-700 font-semibold min-w-[250px] transition-all duration-200 hover:border-blue-300"
                            placeholder={currentQuestion.blanks[index].placeholder}
                            value={userAnswers[currentQuestion.blanks[index].id] || ''}
                            onChange={(e) => handleBlankAnswer(currentQuestion.id, currentQuestion.blanks[index].id, e.target.value)}
                          />
                        )}
                        {/* Indicateur requis */}
                        {currentQuestionData?.required && (
                          <span className="absolute -top-2 -right-2 text-red-500 text-lg">*</span>
                        )}
                      </span>
                    )}
                  </span>
                ))}
              </div>

              {/* Message d'aide */}
              {currentQuestionData?.required && !userAnswers[currentQuestion.blanks[0]?.id] && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-700 text-sm flex items-center">
                    <span className="mr-2">⚠️</span>
                    Cette information est requise pour continuer
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <button
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center px-6 py-3 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <span className="mr-2">←</span> Précédent
                </button>
                
                <button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionData?.required && !userAnswers[currentQuestion.blanks[0]?.id]}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  {currentQuestionIndex === fillInTheBlankQuestions.length - 1 ? (
                    <>
                      <span className="mr-2">✓</span> Terminer
                    </>
                  ) : (
                    <>
                      Suivant <span className="ml-2">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Input normal si pas en mode questionnaire */}
          {!fillInTheBlankMode && (
            <ChatInput
              prompt={prompt}
              setPrompt={setPrompt}
              onSendMessage={sendPrompt}
              onStopStreaming={stopStreaming}
              loading={loading}
              isStreaming={isStreaming}
              showNewQuestionnaireButton={messages.length > 0 && prompt.trim().length > 0}
            />
          )}
        </div>

        {/* Panneau récapitulatif */}
        <SummaryPanel
          questionAnswers={questionAnswerPairs}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={fillInTheBlankQuestions.length}
          isVisible={fillInTheBlankMode || questionAnswerPairs.length > 0}
          isCompleted={!fillInTheBlankMode && questionAnswerPairs.length > 0}
          onNewQuestionnaire={resetForNewQuestionnaire}
          onNewDiscussion={startNewDiscussion}
          onGenerateReport={generateReport}
        />
      </div>
    </div>
  );
}

export default AIAssistant;
