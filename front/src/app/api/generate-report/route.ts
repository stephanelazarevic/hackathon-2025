import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

type Question = {
  id: string;
  question: string;
  type: string;
  options?: string[];
  required: boolean;
};

type QuestionnaireData = {
  title: string;
  description: string;
  questions: Question[];
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { questionnaire, answers, userRequest } = await request.json();

    // Construire le contexte avec les questions et réponses
    let context = `Demande initiale du client: "${userRequest}"\n\n`;
    context += `Questionnaire: ${questionnaire.title}\n\n`;
    
    questionnaire.questions.forEach((question: Question) => {
      const answer = answers[question.id] || 'Non répondu';
      context += `Q: ${question.question}\nR: ${answer}\n\n`;
    });

    const prompt = `
Tu es un consultant expert en événementiel. Génère un rapport CONCIS et ACTIONNABLE basé sur ces informations.

${context}

IMPORTANT: Sois direct et va à l'essentiel. Maximum 800 mots.

Structure ton rapport avec SEULEMENT les sections pertinentes parmi :

## 📋 RÉSUMÉ
- En 2-3 phrases, résume la demande et l'objectif

## 📅 PLANNING DÉTAILLÉ
- Timeline précise avec dates/heures
- Étapes clés chronologiques
- Préparatifs à faire en amont

## 🍽️ MENU (si applicable)
- Suggestions de plats/boissons
- Adaptations selon le type d'événement
- Considérations allergies/régimes

## 🎯 ACTIVITÉS RECOMMANDÉES
- Liste d'activités concrètes
- Durée estimée pour chaque activité
- Matériel nécessaire

## 📍 LIEUX SUGGÉRÉS
- Recommandations de lieux précis
- Capacité et caractéristiques
- Avantages/inconvénients

## 💰 BUDGET ESTIMATIF
- Fourchette de prix réaliste
- Détail par poste si possible

## ⚠️ POINTS D'ATTENTION
- Risques à anticiper
- Solutions préventives

## 🎯 ACTIONS IMMÉDIATES
- 3-5 actions concrètes à faire maintenant
- Priorités et ordre d'exécution

Instructions strictes :
- CONCIS : Phrases courtes, listes à puces
- ACTIONNABLE : Informations précises et utilisables
- ADAPTÉ : Selon le type d'événement (professionnel/personnel)
- PAS de blabla : Directement aux faits
- Si info manquante : Propose des alternatives concrètes

Format Markdown avec émojis pour la lisibilité.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Modèle le plus intelligent d'OpenAI
      messages: [
        {
          role: "system",
          content: "Tu es un consultant expert en événementiel. Tu produis des rapports concis, précis et directement actionnables. Pas de verbiage inutile."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Plus précis pour les comptes-rendus
      max_tokens: 2000,
    });

    const reportContent = response.choices[0]?.message?.content || '';

    // Générer les métadonnées du rapport
    const reportMetadata = {
      title: questionnaire.title || 'Compte-rendu de projet',
      generatedAt: new Date().toISOString(),
      userRequest,
      totalQuestions: questionnaire.questions.length,
      answeredQuestions: Object.keys(answers).length,
      completionRate: Math.round((Object.keys(answers).length / questionnaire.questions.length) * 100)
    };

    return NextResponse.json({ 
      reportContent,
      metadata: reportMetadata,
      questionnaire,
      answers
    });

  } catch (error) {
    console.error('Erreur lors de la génération du compte-rendu:', error);
    
    return NextResponse.json({ 
      error: true,
      message: "Impossible de générer le compte-rendu. Veuillez réessayer."
    }, { status: 500 });
  }
}
