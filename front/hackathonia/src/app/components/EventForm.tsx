'use client';

import { useState } from 'react';
import FormCard from '../../components/FormCard';
import FormInput from '../../components/FormInput';

interface EventFormData {
  projectType: string;
  situation: {
    age: number;
    status: string;
  };
  eventType: string;
  budget: number;
  location: string;
  guests: number;
  date: string;
}

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  onBack: () => void;
}

export default function EventForm({ onSubmit, onBack }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    projectType: '',
    situation: {
      age: 25,
      status: ''
    },
    eventType: '',
    budget: 0,
    location: '',
    guests: 0,
    date: ''
  });

  const projectOptions = ['seul', 'à deux', 'en SCI'];
  const statusOptions = ['étudiant', 'salarié', 'entrepreneur', 'retraité'];
  const eventOptions = ['mariage', 'anniversaire', 'conférence', 'séminaire', 'soirée d\'entreprise', 'autre'];

  const handleProjectSelect = (option: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: option
    }));
  };

  const handleStatusSelect = (option: string) => {
    setFormData(prev => ({
      ...prev,
      situation: {
        ...prev.situation,
        status: option
      }
    }));
  };

  const handleEventSelect = (option: string) => {
    setFormData(prev => ({
      ...prev,
      eventType: option
    }));
  };

  const handleAgeChange = (age: number) => {
    setFormData(prev => ({
      ...prev,
      situation: {
        ...prev.situation,
        age: age
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = () => {
    return formData.projectType && 
           formData.situation.status && 
           formData.eventType && 
           formData.budget > 0 &&
           formData.location &&
           formData.guests > 0 &&
           formData.date;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--chat-input-border)] rounded-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-dark)]">
            Configurons votre événement
          </h2>
          <button
            onClick={onBack}
            className="text-[var(--accent-teal)] hover:text-[var(--accent-teal-dark)] font-medium"
          >
            ← Retour au chat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Votre projet */}
          <FormCard
            title="Votre projet"
            options={projectOptions}
            selectedOption={formData.projectType}
            onSelect={handleProjectSelect}
          />

          {/* Votre situation */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[var(--text-dark)] mb-4">
              Votre situation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Vous avez"
                value={formData.situation.age}
                onChange={handleAgeChange}
                type="number"
                suffix="ans"
                required
              />
              <div>
                <label className="block text-lg font-medium text-[var(--text-dark)] mb-3">
                  Statut
                </label>
                <FormCard
                  title=""
                  options={statusOptions}
                  selectedOption={formData.situation.status}
                  onSelect={handleStatusSelect}
                />
              </div>
            </div>
          </div>

          {/* Type d'événement */}
          <FormCard
            title="Type d'événement"
            options={eventOptions}
            selectedOption={formData.eventType}
            onSelect={handleEventSelect}
          />

          {/* Détails de l'événement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Budget estimé"
              value={formData.budget}
              onChange={(value) => setFormData(prev => ({ ...prev, budget: Number(value) }))}
              type="number"
              placeholder="Ex: 5000"
              suffix="€"
              required
            />
            <FormInput
              label="Nombre d'invités"
              value={formData.guests}
              onChange={(value) => setFormData(prev => ({ ...prev, guests: Number(value) }))}
              type="number"
              placeholder="Ex: 50"
              required
            />
          </div>

          <FormInput
            label="Lieu souhaité"
            value={formData.location}
            onChange={(value) => setFormData(prev => ({ ...prev, location: String(value) }))}
            placeholder="Ex: Paris, salle de réception..."
            required
          />

          <FormInput
            label="Date souhaitée"
            value={formData.date}
            onChange={(value) => setFormData(prev => ({ ...prev, date: String(value) }))}
            type="text"
            placeholder="Ex: 15 juin 2025, été 2025..."
            required
          />

          {/* Bouton de soumission */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                isFormValid()
                  ? 'bg-[var(--accent-teal)] hover:bg-[var(--accent-teal-dark)] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Générer mon plan d'événement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
