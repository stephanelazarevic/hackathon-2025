import React, { useState } from 'react';

interface FillInTheBlankProps {
  question: {
    id: string;
    template: string;
    options: string[];
    placeholder: string;
  };
  onAnswer: (answer: string) => void;
  currentQuestion: number;
  totalQuestions: number;
}

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({
  question,
  onAnswer,
  currentQuestion,
  totalQuestions
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option);
    onAnswer(option);
  };

  // Diviser la phrase template en parties avant et après le placeholder
  const parts = question.template.split(question.placeholder);
  const beforeText = parts[0];
  const afterText = parts[1] || '';

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header avec progression */}
      <div className="flex items-center justify-between mb-8">
        <button className="flex items-center text-gray-600 hover:text-black transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black">Configuration Ervia</h2>
          <p className="text-gray-500 text-sm mt-1">
            Question {currentQuestion + 1} sur {totalQuestions}
          </p>
        </div>
        
        <div className="w-16"></div> {/* Spacer pour centrer le titre */}
      </div>

      {/* Barre de progression */}
      <div className="mb-12">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Introduction</span>
          <span>Configuration</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        
        {/* Étapes */}
        <div className="flex justify-between mt-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-blue-500">Votre projet</span>
          </div>
          <div className="text-gray-400 text-sm">Vos informations</div>
        </div>
      </div>

      {/* Question principale */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-black mb-6 leading-tight">
          {beforeText}
          <span className="relative">
            <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg border-2 border-dashed border-blue-300 inline-block min-w-[200px] text-center">
              {selectedAnswer || question.placeholder}
            </span>
          </span>
          {afterText}
        </h3>
      </div>

      {/* Options */}
      <div className="grid gap-3 max-w-2xl">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>

      {/* Bouton suivant */}
      {selectedAnswer && (
        <div className="mt-8 flex justify-end">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
            {currentQuestion + 1 === totalQuestions ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlank;
