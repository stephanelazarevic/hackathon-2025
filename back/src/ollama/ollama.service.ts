import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Injectable()
export class OllamaService {
  private readonly OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';

  async streamGenerate(prompt: string, model: string = 'llama3', res: Response): Promise<void> {
    try {
      const ollamaResponse = await axios.post(
        this.OLLAMA_URL,
        { model, prompt, stream: true },
        { responseType: 'stream' }
      );

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      ollamaResponse.data.pipe(res);
    } catch (err) {
      console.error('Erreur de stream depuis Ollama:', err.message);
      res.status(500).send('Erreur interne avec Ollama');
    }
  }
}
