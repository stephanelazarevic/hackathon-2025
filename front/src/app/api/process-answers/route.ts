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
    const { questionnaire, answers, additionalMessages }: { 
      questionnaire: QuestionnaireData; 
      answers: Record<string, string>;
      additionalMessages?: Array<{ role: string; content: string }>;
    } = await request.json();

    // Construire le contexte avec les questions et réponses
    let context = `Questionnaire: ${questionnaire.title}\n\n`;
    
    questionnaire.questions.forEach((question: Question) => {
      const answer = answers[question.id] || 'Non répondu';
      context += `Q: ${question.question}\nR: ${answer}\n\n`;
    });

    // Ajouter les messages supplémentaires si disponibles
    if (additionalMessages && additionalMessages.length > 0) {
      context += `\nINFORMATIONS SUPPLÉMENTAIRES DE LA CONVERSATION:\n`;
      additionalMessages.forEach((msg) => {
        context += `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}\n`;
      });
      context += '\n';
    }

    const prompt = `
Tu es un expert consultant en événementiel et organisation. Analyse ces réponses et fournis des conseils détaillés, des suggestions créatives et des recommandations pratiques.

${context}

Instructions DÉTAILLÉES :
${additionalMessages && additionalMessages.length > 0 ? 
  '⚠️ **IMPORTANT** : L\'utilisateur a fourni des informations supplémentaires après le questionnaire. Intègre-les ABSOLUMENT dans ton analyse et tes recommandations.\n\n' : 
  ''}1. 📋 **ANALYSE** : Résume les informations clés en 1-2 phrases${additionalMessages && additionalMessages.length > 0 ? ' (incluant les précisions supplémentaires)' : ''}
2. 💡 **CONSEILS PERSONNALISÉS** : Donne 3-4 conseils spécifiques basés sur TOUTES les informations disponibles
3. 🎉 **SUGGESTIONS CRÉATIVES** : Propose 2-3 idées originales pour l'événement/projet
4. 📍 **RECOMMANDATIONS DE LIEUX** : Suggère des types de lieux appropriés
5. 🍽️ **SUGGESTIONS CULINAIRES** : Recommande menu/traiteur selon le contexte
6. 💰 **OPTIMISATION BUDGET** : Conseils pour bien utiliser le budget mentionné
7. ⚠️ **POINTS D'ATTENTION** : 2-3 choses importantes à ne pas oublier
8. 🎯 **PROCHAINES ÉTAPES** : Actions concrètes à entreprendre

Ton style :
- Professionnel mais chaleureux
- Conseils concrets et actionnables
- Utilise des émojis pour structurer
- Adapte le ton au type d'événement
- Maximum 500 mots, bien structuré

Sois créatif, inspirant et pratique !
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Tu es un expert consultant en événementiel avec 10 ans d'expérience. Tu donnes des conseils personnalisés, créatifs et pratiques. Tu es enthousiaste, professionnel et tu inspires confiance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7, // Plus créatif pour les suggestions
      max_tokens: 1000,
    });

    const finalResponse = response.choices[0]?.message?.content || '';

    return NextResponse.json({ 
      finalResponse,
      summary: `Questionnaire "${questionnaire.title}" complété avec ${Object.keys(answers).length} réponses.`
    });

  } catch (error) {
    console.error('Erreur lors du traitement des réponses:', error);
    
    return NextResponse.json({ 
      finalResponse: "Merci pour toutes vos réponses ! Je vais analyser vos informations et vous fournir des recommandations personnalisées. Malheureusement, une erreur technique est survenue lors du traitement, mais je peux quand même vous aider si vous me reposez votre question.",
      error: true
    });
  }
}
