import 'dotenv/config';

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { loadAgentPrompt } from "./local_generate_prompt";
import { sportEquipmentTool } from './tools/sportTool';
import { culturalEquipmentTool } from './tools/cultureTool';

const eventPrompt = loadAgentPrompt('event');

class LocalChatOpenAI extends ChatOpenAI {
  async getNumTokens(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
}

const agentModel = new LocalChatOpenAI({ 
  temperature: 0.8,
  model: "dolphin3.0-llama3.1-8b",
  streaming: true, 
  configuration: {
    baseURL: "http://127.0.0.1:1234/v1",
    apiKey: "not-needed"
  }
});

export const eventAgent = createReactAgent({
  prompt: eventPrompt,
  llm: agentModel,
  tools: [sportEquipmentTool, culturalEquipmentTool],
});
