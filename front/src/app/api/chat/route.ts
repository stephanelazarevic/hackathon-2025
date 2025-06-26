import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    // Construire le prompt avec le contexte si fourni
    let systemMessage = `Tu es un assistant IA expert en événementiel, organisation et conseils personnalisés. 

Tes qualités :
- 🎯 EXPERTISE : Tu maîtrises l'organisation d'événements, le conseil en communication, la logistique
- 💡 CRÉATIVITÉ : Tu proposes des idées originales et inspirantes
- 🔧 PRATICITÉ : Tes conseils sont concrets et actionnables
- 🤝 PERSONNALISATION : Tu adaptes tes réponses au contexte de chaque utilisateur
- 📊 DÉTAIL : Tu donnes des informations précises (budgets, timelines, prestataires)

Style de réponse :
- Réponds TOUJOURS en français
- Structure tes réponses avec des émojis
- Donne des exemples concrets
- Propose des alternatives créatives
- Inclus des conseils budget/timing
- Sois enthousiaste et professionnel

Tu peux aider sur : événements (mariages, anniversaires, entreprise), organisation, décoration, budget, planning, prestataires, etc.`;
    
    if (context) {
      systemMessage += `\n\nContexte de la conversation précédente: ${context}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = response.choices[0]?.message?.content || '';

    return NextResponse.json({ 
      response: aiResponse
    });

  } catch (error) {
    console.error('Erreur lors du chat:', error);
    
    return NextResponse.json({ 
      response: "Désolé, une erreur technique est survenue. Pouvez-vous reformuler votre question ?",
      error: true
    });
  }
}