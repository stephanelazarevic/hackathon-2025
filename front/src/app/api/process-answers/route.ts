import { NextRequest, NextResponse } from 'next/server';
import { ChatOllama } from "@langchain/ollama";

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

const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // URL par défaut d'Ollama
  model: "llama3",
  temperature: 0.7,
});

export async function POST(request: NextRequest) {
  try {
    const { questionnaire, answers }: { questionnaire: QuestionnaireData; answers: Record<string, string> } = await request.json();

    // Construire le contexte avec les questions et réponses
    let context = `Questionnaire: ${questionnaire.title}\n\n`;
    
    questionnaire.questions.forEach((question: Question) => {
      const answer = answers[question.id] || 'Non répondu';
      context += `Q: ${question.question}\nR: ${answer}\n\n`;
    });

    const prompt = `
Basé sur ce questionnaire complété par l'utilisateur, génère une réponse complète, personnalisée et utile. En français, en utilisant les réponses fournies pour donner des conseils pratiques et adaptés.

${context}

Instructions:
1. Analyse toutes les réponses fournies
2. Identifie les besoins principaux de l'utilisateur
3. Fournis des recommandations concrètes et détaillées
4. Inclus des conseils pratiques et actionables
5. Structure ta réponse de manière claire avec des sections
6. Sois professionnel mais accessible
7. Adapte ton ton au contexte (formel pour business, décontracté pour personnel)

Génère une réponse de 200-400 mots maximum, bien structurée et immédiatement utile.
`;

    const response = await model.invoke([
      { role: 'system', content: 'Tu es Ervia, un assistant IA expert qui fournit des conseils personnalisés basés sur les réponses des utilisateurs. Tu es serviable, précis et donnes des conseils concrets.' },
      { role: 'user', content: prompt }
    ]);

    const finalResponse = response.content as string;

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
