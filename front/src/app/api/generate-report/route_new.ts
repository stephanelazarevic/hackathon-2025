import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

type Question = {
  id: string;
  question: string;
  type: string;
  options?: string[];
  required: boolean;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POSTrequest: NextRequest) {
  try {
    const { questionnaire, answers, userRequest } = await request.json();

    const prompt = `
Tu es un consultant expert en événementiel. Analyse la demande utilisateur et génère un rapport PARFAITEMENT ADAPTÉ.

DEMANDE INITIALE: "${userRequest}"

QUESTIONNAIRE COMPLÉTÉ: ${questionnaire.title}

RÉPONSES COLLECTÉES:
${questionnaire.questions.map((question: Question) => {
  const answer = answers[question.id] || 'Non répondu';
  return `Q: ${question.question}\nR: ${answer}`;
}).join('\n\n')}

INSTRUCTIONS CRUCIALES:
1. ANALYSE INTELLIGEMMENT la demande pour déterminer EXACTEMENT ce qui est demandé
2. Si c'est un planning → génère SEULEMENT un planning détaillé
3. Si c'est un menu → génère SEULEMENT un menu complet  
4. Si ce sont des idées d'activités → génère SEULEMENT des activités
5. Si ce sont des lieux → génère SEULEMENT des suggestions de lieux
6. Si c'est multiple → combine intelligemment selon la demande
7. NE RAJOUTE JAMAIS de sections non demandées

STRUCTURE TON RAPPORT avec les sections PERTINENTES parmi:
- 📋 Résumé exécutif (toujours 2-3 phrases max)
- 📅 Planning détaillé (si demandé)
- 🍽️ Menu complet (si demandé) 
- 📍 Lieux recommandés (si demandé)
- 🎯 Activités suggérées (si demandé)
- 💰 Budget estimatif (si budget mentionné)
- 🎁 Idées cadeaux (si demandé)
- 🎨 Décoration & ambiance (si demandé)
- 🔧 Logistique & organisation (si demandé)
- ✉️ Invitations & communication (si demandé)
- 🎯 Actions immédiates (toujours 3-5 actions prioritaires avec deadlines)

EXIGENCES DE QUALITÉ:
- CONCIS mais COMPLET (max 1000 mots)
- ACTIONNABLE avec infos précises
- ADAPTÉ au contexte (pro/perso, budget, nombre de personnes...)
- Markdown avec émojis pour la lisibilité
- Si une info manque: propose des alternatives concrètes

Tu dois analyser finement la demande et ne générer QUE ce qui est demandé, sans sur-interpréter.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es un consultant expert en événementiel avec 15 ans d'expérience. Tu t'adaptes parfaitement aux demandes spécifiques de tes clients. Si on te demande seulement un menu, tu ne génères qu'un menu. Si on te demande des idées cadeaux, tu ne génères que des idées cadeaux. Tu ne rajoutes jamais de sections non demandées. Tu es très intelligent et peux analyser précisément ce qui est demandé.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
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
