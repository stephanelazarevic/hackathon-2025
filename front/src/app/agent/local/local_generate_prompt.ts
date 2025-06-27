import fs from 'fs';
import path from 'path';

function replacePromptVariables(template: string, context: Record<string, string>): string {
  return Object.entries(context).reduce((acc, [key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    return acc.replace(regex, value);
  }, template);
}

export function loadAgentPrompt(agentId: string): string {
  const now = new Date();

  const variables = {
    id: agentId,
    date: now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    heure: now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    iso_date: now.toISOString().split('T')[0],
    iso_time: now.toISOString().split('T')[1].split('.')[0],
  };

  const promptPath = path.join(process.cwd(), 'src', 'app', 'agent', 'local', `${agentId}.md`);

  if (!fs.existsSync(promptPath)) {
    throw new Error(`Prompt file not found: ${promptPath}`);
  }

  const rawPrompt = fs.readFileSync(promptPath, 'utf-8');
  return replacePromptVariables(rawPrompt, variables);
}
