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

Tu dois analyser intelligemment la demande et créer des questions pertinentes et spécifiques au contexte.

Tu dois retourner UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "title": "Titre du questionnaire",
  "description": "Description courte",
  "questions": [
    {
      "id": "question_1",
      "question": "Question formulée comme une phrase avec un BLANC à compléter",
      "type": "text|choice|number|date",
      "options": ["option1", "option2"] // seulement si type = "choice",
      "required": true/false
    }
  ]
}

Règles STRICTES pour les questions :
- Maximum 10 questions pertinentes
- Formule les questions comme des PHRASES avec des BLANCS (___)
- Exemples PARFAITS à suivre :
  * "Il y aura ___ personnes à mon événement"
  * "Je prévois un budget de ___ €"
  * "Mon événement aura lieu le ___"
  * "La durée prévue sera de ___ heures"
  * "Le style souhaité est ___"
  * "L'âge moyen des invités sera de ___ ans"
  * "Mon événement se déroulera ___" (lieu)
- La phrase doit être NATURELLE et contenir ___ là où l'utilisateur doit répondre
- Types appropriés (text, choice, number, date)
- Possible d'avoir plusieurs options pour les questions à choix
- Au moins 50% des questions doivent être required: true
- Pour les questions à choix, fournis entre 3-6 options logiques et pertinentes
- Adapte les questions au contexte (mariage, anniversaire, entreprise, etc.), et prends en compte le ton et le style de l'événement, et le nombre de participants si mentionné.
- Si le contexte n'est pas clair, pose des questions générales pour clarifier et préparer au mieux le résumé final.

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
          question: "Mon projet concerne ___",
          type: "text",
          required: true
        },
        {
          id: "participants",
          question: "Il y aura ___ personnes",
          type: "number",
          required: true
        },
        {
          id: "timeline",
          question: "Je souhaite que ce projet soit réalisé ___",
          type: "choice",
          options: ["dans la semaine", "dans le mois", "dans les 3 mois", "sans urgence particulière"],
          required: true
        },
        {
          id: "budget",
          question: "Je prévois un budget de ___ €",
          type: "text",
          required: false
        },
        {
          id: "style",
          question: "L'ambiance souhaitée est ___",
          type: "choice",
          options: ["décontractée", "élégante", "festive", "professionnelle", "intime"],
          required: false
        }
      ]
    };
    
    return NextResponse.json(fallbackQuestionnaire);
  }
}
