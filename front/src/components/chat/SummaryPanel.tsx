'use client';

import React, { useState } from 'react';

interface QuestionAnswerPair {
  questionId: string;
  question: string;
  answer: string;
  questionNumber: number;
}

interface SummaryPanelProps {
  questionAnswers: QuestionAnswerPair[];
  currentQuestionIndex: number;
  totalQuestions: number;
  isVisible: boolean;
  isCompleted?: boolean;
  onNewQuestionnaire?: () => void;
  onNewDiscussion?: () => void;
  onGenerateReport?: () => void;
  onRegenerateSummary?: () => Promise<void>;
  hasAdditionalInfo?: boolean;
}

export default function SummaryPanel({ 
  questionAnswers, 
  currentQuestionIndex, 
  totalQuestions, 
  isVisible,
  isCompleted = false,
  onNewQuestionnaire,
  onNewDiscussion,
  onGenerateReport,
  onRegenerateSummary,
  hasAdditionalInfo = false
}: SummaryPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      {/* Bouton toggle pour mobile */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-20 right-4 z-50 bg-[#5F95FF] text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200"
      >
        {isCollapsed ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>

      {/* Panneau principal */}
      <div className={`
        ${isCollapsed ? 'translate-x-full lg:translate-x-0' : 'translate-x-0'}
        fixed lg:relative top-16 lg:top-auto right-0 lg:right-auto
        w-80 lg:w-80 h-[calc(100vh-4rem)] lg:h-[calc(100vh)]
        bg-white border-l border-gray-200 flex flex-col
        z-40 lg:z-auto
        transition-transform duration-300 ease-in-out lg:transition-none
        shadow-xl lg:shadow-none
      `}>
        {/* Header */}
        <div className="bg-[#5F95FF] text-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {isCompleted ? 'Historique des réponses' : 'Récapitulatif'}
              </h3>
              <p className="text-sm text-blue-100 mt-1">
                {isCompleted 
                  ? `${questionAnswers.length} réponses enregistrées`
                  : `${questionAnswers.length} / ${totalQuestions} questions répondues`
                }
              </p>
            </div>
            {/* Bouton fermer sur mobile */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="lg:hidden text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progression</span>
          <span>{Math.round((questionAnswers.length / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#5F95FF] h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(questionAnswers.length / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4">
        {questionAnswers.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-3">📝</div>
            <p>Vos réponses apparaîtront ici au fur et à mesure</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questionAnswers.map((qa, index) => (
              <div 
                key={qa.questionId}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  index === questionAnswers.length - 1 
                    ? 'border-[#5F95FF] bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-[#5F95FF] bg-blue-100 px-2 py-1 rounded-full">
                    Question {qa.questionNumber}
                  </span>
                  {index === questionAnswers.length - 1 && (
                    <span className="text-xs text-green-600 font-medium">
                      ✓ Dernière réponse
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Question :</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {qa.question}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Réponse :</p>
                    <p className="text-sm text-gray-900 font-medium bg-gray-50 p-2 rounded border">
                      {qa.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with current question info */}
      {totalQuestions > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
          <div className="text-center">
            {isCompleted ? (
              <div className="space-y-3">
                <div className="text-green-600">
                  <p className="text-sm font-medium">✓ Questionnaire terminé</p>
                  <p className="text-xs text-green-500 mt-1">
                    Vos réponses ont été analysées
                  </p>
                </div>
                <div className="space-y-2">
                  {hasAdditionalInfo && onRegenerateSummary && (
                    <button
                      onClick={onRegenerateSummary}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors duration-200"
                    >
                      🔄 Mettre à jour le résumé
                    </button>
                  )}
                  {onGenerateReport && (
                    <button
                      onClick={onGenerateReport}
                      className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors duration-200"
                    >
                      📊 Générer un rapport
                    </button>
                  )}
                  {onNewQuestionnaire && (
                    <button
                      onClick={onNewQuestionnaire}
                      className="w-full bg-[#5F95FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
                    >
                      + Nouveau questionnaire
                    </button>
                  )}
                  {onNewDiscussion && (
                    <button
                      onClick={onNewDiscussion}
                      className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                    >
                      🗨️ Nouvelle discussion
                    </button>
                  )}
                </div>
              </div>
            ) : questionAnswers.length < totalQuestions ? (
              <div>
                <p className="text-sm text-gray-600">
                  Question suivante : <span className="font-medium">{currentQuestionIndex + 1}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Répondez dans le chat pour continuer
                </p>
              </div>
            ) : (
              <div className="text-green-600">
                <p className="text-sm font-medium">✓ Questionnaire terminé</p>
                <p className="text-xs text-green-500 mt-1">
                  Toutes les questions ont été répondues
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {/* Overlay pour mobile */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
