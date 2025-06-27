import { NextRequest, NextResponse } from 'next/server';
import { eventAgent } from '@/app/agent/local/myLocalAgent';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages manquant' }, { status: 400 });
    }

    console.log('Messages envoyés à l\'agent:', messages);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const eventStream = eventAgent.streamEvents(
            { messages }, 
            { version: "v2" }
          );

          let fullResponse = '';

          for await (const event of eventStream) {
            if (event.event === 'on_chat_model_stream' && event.data?.chunk?.content) {
              const chunk = event.data.chunk.content;
              fullResponse += chunk;
              
              const data = JSON.stringify({ 
                type: 'chunk', 
                content: chunk,
                fullContent: fullResponse 
              });
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
            }
          }

          const endData = JSON.stringify({ 
            type: 'end', 
            fullContent: fullResponse 
          });
          controller.enqueue(new TextEncoder().encode(`data: ${endData}\n\n`));
          controller.close();

        } catch (error) {
          console.error('Erreur streaming:', error);
          const errorData = JSON.stringify({ 
            type: 'error', 
            error: 'Erreur lors du streaming' 
          });
          controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (err) {
    console.error('Erreur agent :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}