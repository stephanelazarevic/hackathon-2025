import React from 'react';
import Image from 'next/image';

interface WelcomeMessageProps {
  onSuggestionClick?: (suggestion: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    "Je veux organiser un mariage pour 150 invités",
    "J'ai besoin d'aide pour planifier un événement d'entreprise",
    "Je souhaite créer un planning pour mon projet",
    "Je veux organiser un anniversaire surprise"
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="max-w-2xl w-full text-center">
        {/* Avatar IA */}
          <div className="flex justify-center mb-4">
          <Image
            src="/img/ervia_small_logo.png"
            alt="Ervia Logo"
            width={64}
            height={64}
            priority
          />
        </div>
        
        {/* Message de bienvenue */}
        <div className="bg-gray-50 rounded-2xl px-6 py-4 border border-gray-200 mb-6">
          <div className="text-gray-800 leading-relaxed text-sm">
            Bonjour ! Je suis <span className="font-semibold text-blue-500">Ervia</span>, votre assistant IA. Comment puis-je vous aider aujourd&apos;hui ?
          </div>
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick?.(suggestion)}
              className="p-4 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {index === 0 ? "💒" : index === 1 ? "🏢" : index === 2 ? "📋" : "🎉"}
                </span>
                <span className="text-gray-700 text-sm font-medium group-hover:text-blue-600">
                  {suggestion}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Ou écrivez votre propre demande ci-dessous
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
