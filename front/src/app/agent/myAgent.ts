import 'dotenv/config';

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { loadAgentPrompt } from "./generate_prompt";

const eventPrompt = loadAgentPrompt('event');

const agentModel = new ChatOpenAI({ 
  temperature: 0.5,
  model: "llama3",
  streaming: true, 
  configuration: {
    baseURL: "http://127.0.0.1:11434/v1",
    apiKey: "not-needed"
  }
});

export const eventAgent = createReactAgent({
  prompt: eventPrompt,
  llm: agentModel,
  tools: [],
});