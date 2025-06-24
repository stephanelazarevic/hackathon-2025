import { Controller, Post, Body, Res } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { Response } from 'express';

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Post('generate')
  async generate(@Body() body: any, @Res() res: Response) {
    const { prompt, model = 'llama3' } = body;
    return this.ollamaService.streamGenerate(prompt, model, res);
  }
}
