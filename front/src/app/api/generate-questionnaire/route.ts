import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userRequest } = await request.json();

    const prompt = `
Analyse cette demande utilisateur et génère un questionnaire JSON structuré pour recueillir toutes les informations nécessaires.
Les questions seront présentées sous forme de "phrases à trou" où l'utilisateur complète des blancs.

Demande utilisateur: "${userRequest}"

Tu dois retourner UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "title": "Titre du questionnaire",
  "description": "Description courte",
  "questions": [
    {
      "id": "question_1",
      "question": "Question formulée comme une affirmation à compléter (ex: 'Mon budget pour ce projet est' au lieu de 'Quel est votre budget ?')",
      "type": "text|choice|number|date",
      "options": ["option1", "option2"] // seulement si type = "choice",
      "required": true/false
    }
  ]
}

Règles importantes:
- Maximum 7 questions pertinentes
- Formule les questions comme des AFFIRMATIONS à compléter, pas comme des questions
- Exemples de bonnes formulations:
  * "Mon événement aura lieu le" (au lieu de "Quand aura lieu votre événement ?")
  * "Le nombre d'invités sera d'environ" (au lieu de "Combien d'invités ?")
  * "Mon budget est de" (au lieu de "Quel est votre budget ?")
- Types appropriés (text, choice, number, date)
- Au moins 50% des questions doivent être required: true
- Pour les questions à choix, fournis entre 3-6 options logiques et pertinentes
- Adapte les questions au contexte (événement, projet, service, etc.)

Retourne UNIQUEMENT le JSON, aucun autre texte.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Modèle le plus intelligent d'OpenAI
      messages: [
        {
          role: "system",
          content: "Tu es un expert en création de questionnaires. Tu retournes toujours un JSON valide sans aucun texte supplémentaire."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Plus précis pour générer du JSON
      max_tokens: 1500,
    });

    let jsonContent = response.choices[0]?.message?.content || '';
    
    // Nettoyer le contenu pour extraire uniquement le JSON
    jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parser le JSON pour valider
    const questionnaireData = JSON.parse(jsonContent);
    
    // Valider la structure
    if (!questionnaireData.title || !questionnaireData.questions || !Array.isArray(questionnaireData.questions)) {
      throw new Error('Structure JSON invalide');
    }

    return NextResponse.json(questionnaireData);

  } catch (error) {
    console.error('Erreur lors de la génération du questionnaire:', error);
    
    // Retourner un questionnaire par défaut en cas d'erreur
    const fallbackQuestionnaire = {
      title: "Questionnaire personnalisé",
      description: "Quelques questions pour mieux vous aider",
      questions: [
        {
          id: "context",
          question: "Mon projet concerne",
          type: "text",
          required: true
        },
        {
          id: "timeline",
          question: "Je souhaite que ce projet soit réalisé",
          type: "choice",
          options: ["Dans la semaine", "Dans le mois", "Dans les 3 mois", "Sans urgence particulière"],
          required: true
        },
        {
          id: "budget",
          question: "Mon budget approximatif est de",
          type: "text",
          required: false
        }
      ]
    };
    
    return NextResponse.json(fallbackQuestionnaire);
  }
}
