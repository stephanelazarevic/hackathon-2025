'use client';

import { useState } from 'react';
import FormCard from './FormCard';
import FormInput from './FormInput';

interface StepFormData {
  eventType: string;
  projectType: string;
  guests: number;
  budget: number;
  date: string;
  location: string;
  status: string;
  age: number;
  theme: string;
  atmosphere: string;
  priority: string;
}

interface StepFormProps {
  onComplete: (data: StepFormData) => void;
  onBack: () => void;
}

interface Step {
  id: string;
  question: string;
  type: 'choice' | 'input' | 'number';
  options?: string[];
  inputType?: 'text' | 'number';
  suffix?: string;
  placeholder?: string;
}

const steps: Step[] = [
  {
    id: 'eventType',
    question: 'Vous souhaitez organiser un événement de type',
    type: 'choice',
    options: ['mariage', 'anniversaire', 'conférence', 'séminaire', 'soirée d\'entreprise', 'fête familiale', 'lancement produit', 'autre']
  },
  {
    id: 'projectType',
    question: 'Vous organisez cet événement',
    type: 'choice',
    options: ['seul(e)', 'en couple', 'en équipe', 'avec des amis', 'pour votre entreprise']
  },
  {
    id: 'guests',
    question: 'Vous attendez environ __ invités.',
    type: 'number',
    placeholder: '50'
  },
  {
    id: 'budget',
    question: 'Votre budget total est de __ €.',
    type: 'number',
    suffix: '€',
    placeholder: '5000'
  },
  {
    id: 'date',
    question: 'La date souhaitée est le __',
    type: 'input',
    inputType: 'text',
    placeholder: '15 juin 2025, été 2025, dans 3 mois...'
  },
  {
    id: 'location',
    question: 'L\'événement aura lieu à __',
    type: 'input',
    inputType: 'text',
    placeholder: 'Paris, Lyon, chez moi, en extérieur...'
  },
  {
    id: 'theme',
    question: 'Le thème ou style souhaité est',
    type: 'choice',
    options: ['élégant & raffiné', 'décontracté & convivial', 'moderne & tendance', 'vintage & rétro', 'bohème & naturel', 'glamour & festif', 'professionnel & sobre', 'personnalisé']
  },
  {
    id: 'atmosphere',
    question: 'L\'ambiance que vous recherchez est plutôt',
    type: 'choice',
    options: ['intime & chaleureuse', 'festive & animée', 'calme & sereine', 'dynamique & énergique', 'sophistiquée & classe', 'fun & décontractée']
  },
  {
    id: 'priority',
    question: 'Votre priorité principale est',
    type: 'choice',
    options: ['la qualité de la nourriture', 'l\'animation & divertissement', 'la décoration & ambiance', 'le confort des invités', 'les photos & souvenirs', 'respecter le budget', 'l\'originalité de l\'événement']
  },
  {
    id: 'status',
    question: 'Concernant l\'organisation d\'événements, vous êtes',
    type: 'choice',
    options: ['débutant(e)', 'amateur(e)', 'expérimenté(e)', 'professionnel(le)']
  },
  {
    id: 'age',
    question: 'L\'âge moyen des invités sera d\'environ __ ans.',
    type: 'number',
    suffix: 'ans',
    placeholder: '30'
  }
];

export default function StepForm({ onComplete, onBack }: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);  const [formData, setFormData] = useState<StepFormData>({
    eventType: '',
    projectType: '',
    guests: 0,
    budget: 0,
    date: '',
    location: '',
    theme: '',
    atmosphere: '',
    priority: '',
    status: '',
    age: 0
  });

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const getCurrentValue = () => {
    const key = currentStepData.id as keyof StepFormData;
    return formData[key];
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(formData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (isFirstStep) {
      onBack();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChoiceSelect = (option: string) => {
    setFormData(prev => ({
      ...prev,
      [currentStepData.id]: option
    }));
  };

  const handleInputChange = (value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [currentStepData.id]: value
    }));
  };

  const isCurrentStepValid = () => {
    const currentValue = getCurrentValue();
    if (currentStepData.type === 'choice') {
      return currentValue !== '';
    }
    if (currentStepData.type === 'number') {
      return currentValue > 0;
    }
    if (currentStepData.type === 'input') {
      return currentValue !== '';
    }
    return false;
  };

  const renderStepContent = () => {
    const currentValue = getCurrentValue();

    if (currentStepData.type === 'choice') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--text-dark)] text-center mb-8">
            {currentStepData.question}{' '}
            <span className="text-[var(--accent-teal)]">
              {currentValue ? `"${currentValue}"` : '___'}
            </span>
            .
          </h2>
          <FormCard
            title=""
            options={currentStepData.options!}
            selectedOption={currentValue as string}
            onSelect={handleChoiceSelect}
          />
        </div>
      );
    }

    if (currentStepData.type === 'number' || currentStepData.type === 'input') {
      const questionParts = currentStepData.question.split('__');
      
      return (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-[var(--text-dark)] text-center mb-8">
            {questionParts[0]}
            <span className="mx-2">
              <input
                type={currentStepData.type === 'number' ? 'number' : 'text'}
                value={currentValue}
                onChange={(e) => handleInputChange(
                  currentStepData.type === 'number' ? Number(e.target.value) : e.target.value
                )}
                placeholder={currentStepData.placeholder}
                className="inline-block w-auto min-w-[120px] px-3 py-2 bg-white border-2 border-[var(--accent-teal)] rounded-lg text-[var(--accent-teal)] text-center focus:outline-none focus:border-[var(--accent-teal-dark)] font-semibold"
                autoFocus
              />
            </span>
            {questionParts[1]}
            {currentStepData.suffix && (
              <span className="text-[var(--text-muted)] ml-1">
                {currentStepData.suffix}
              </span>
            )}
          </h2>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--chat-input-border)] rounded-xl p-8">
        {/* En-tête avec progression */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePrevious}
            className="text-[var(--accent-teal)] hover:text-[var(--accent-teal-dark)] font-medium flex items-center"
          >
            ← {isFirstStep ? 'Retour au chat' : 'Précédent'}
          </button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-[var(--accent-teal)]'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <span className="text-[var(--text-muted)] text-sm">
            {currentStep + 1} / {steps.length}
          </span>
        </div>        {/* Contenu de l'étape */}
        <div className="min-h-[300px] flex flex-col justify-center transition-all duration-500 ease-in-out">
          <div className="animate-fadeIn">
            {renderStepContent()}
          </div>
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-end pt-8">
          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              isCurrentStepValid()
                ? 'bg-[var(--accent-teal)] hover:bg-[var(--accent-teal-dark)] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLastStep ? 'Générer mon plan d\'événement' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}
