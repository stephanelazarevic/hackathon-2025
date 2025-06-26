import { NextRequest, NextResponse } from 'next/server';
import { ChatOllama } from "@langchain/ollama";

const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // URL par défaut d'Ollama
  model: "llama3",
  temperature: 0.7,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    // Construire le prompt avec le contexte si fourni
    let systemMessage = 'Tu es Ervia, un assistant IA serviable et intelligent. Tu réponds de manière claire, précise et utile aux questions des utilisateurs. Et surtout en français.';
    
    if (context) {
      systemMessage += `\n\nContexte de la conversation précédente: ${context}`;
    }

    const response = await model.invoke([
      { role: 'system', content: systemMessage },
      ...messages
    ]);

    const aiResponse = response.content as string;

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
